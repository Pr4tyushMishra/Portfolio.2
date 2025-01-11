from flask import Flask, render_template, request, jsonify, send_from_directory, redirect
from flask_cors import CORS
import os
import json
from datetime import datetime
import traceback
from dotenv import load_dotenv
from werkzeug.urls import url_quote
from werkzeug.utils import secure_filename

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Create uploads directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    print("Serving index page...")
    return render_template('index.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/save-portfolio', methods=['POST'])
def save_portfolio():
    try:
        data = request.form.to_dict(flat=False)
        
        # Process the form data
        portfolio_data = {
            'name': data.get('name', [''])[0],
            'title': data.get('title', [''])[0],
            'bio': data.get('bio', [''])[0],
            'email': data.get('email', [''])[0],
            'linkedin': data.get('linkedin', [''])[0],
            'github': data.get('github', [''])[0],
            'theme': data.get('theme', ['modern'])[0],
            'skills': data.get('skills[]', []),
            'projects': []
        }

        # Process projects
        project_titles = data.get('projects[][title]', [])
        project_descriptions = data.get('projects[][description]', [])
        
        for i in range(len(project_titles)):
            if project_titles[i].strip():  # Only add if title is not empty
                project = {
                    'title': project_titles[i],
                    'description': project_descriptions[i] if i < len(project_descriptions) else '',
                }
                portfolio_data['projects'].append(project)

        # Save to file
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        with open(os.path.join(UPLOAD_FOLDER, 'portfolio.json'), 'w') as f:
            json.dump(portfolio_data, f, indent=2)

        return jsonify({'status': 'success'})
    except Exception as e:
        print(f"FULL ERROR in save_portfolio: {e}")
        print(traceback.format_exc())
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/portfolio/editor')
def portfolio_editor():
    return render_template('portfolio_editor.html')

@app.route('/portfolio/view')
def portfolio_view():
    try:
        # Read portfolio data
        portfolio_path = os.path.join(UPLOAD_FOLDER, 'portfolio.json')
        if not os.path.exists(portfolio_path):
            return "Portfolio not found", 404
            
        with open(portfolio_path, 'r') as f:
            portfolio_data = json.load(f)
            
        return render_template('portfolio.html', portfolio=portfolio_data)
    except Exception as e:
        print(f"FULL ERROR in portfolio_view: {e}")
        print(traceback.format_exc())
        return str(e), 500

@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    try:
        if 'file' not in request.files:
            return jsonify({"status": "error", "message": "No file part"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"status": "error", "message": "No selected file"}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return jsonify({
                "status": "success",
                "filename": filename,
                "url": f"/uploads/{url_quote(filename)}"
            })
        
        return jsonify({"status": "error", "message": "File type not allowed"}), 400
    
    except Exception as e:
        print(f"FULL ERROR in upload_image: {e}")
        print(traceback.format_exc())
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/resume/templates')
def resume_templates():
    return render_template('resume_templates.html')

@app.route('/resume/create/professional')
def create_professional_resume():
    # Load any existing resume data
    resume_data = {}
    resume_file = os.path.join(UPLOAD_FOLDER, 'resume.json')
    if os.path.exists(resume_file):
        with open(resume_file, 'r') as f:
            resume_data = json.load(f)
    
    return render_template('professional_template.html', resume_data=resume_data)

@app.route('/resume/create/<template_type>')
def create_resume(template_type):
    # Validate template type
    valid_templates = ['professional', 'creative', 'modern', 'technical']
    if template_type not in valid_templates:
        return redirect('/resume/templates')
    
    # Load any existing resume data
    resume_data = {}
    resume_file = os.path.join(UPLOAD_FOLDER, 'resume.json')
    if os.path.exists(resume_file):
        with open(resume_file, 'r') as f:
            resume_data = json.load(f)
    
    return render_template(f'resume_editor_{template_type}.html', resume_data=resume_data)

@app.route('/api/save-resume', methods=['POST'])
def save_resume():
    try:
        data = request.json
        print(f"Received resume data: {data}")
        
        # Save resume data to a JSON file
        with open(os.path.join(UPLOAD_FOLDER, 'resume.json'), 'w') as f:
            json.dump(data, f, indent=2)
        
        return jsonify({
            "status": "success", 
            "message": "Resume saved successfully"
        })
    
    except Exception as e:
        print(f"FULL ERROR in save_resume: {e}")
        print(traceback.format_exc())
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/get-resume')
def get_resume():
    try:
        resume_file = os.path.join(UPLOAD_FOLDER, 'resume.json')
        if os.path.exists(resume_file):
            with open(resume_file, 'r') as f:
                resume_data = json.load(f)
            return jsonify({
                "status": "success",
                "data": resume_data
            })
        else:
            return jsonify({
                "status": "success",
                "data": {
                    "personalInfo": {},
                    "experience": [],
                    "education": [],
                    "skills": []
                }
            })
    
    except Exception as e:
        print(f"FULL ERROR in get_resume: {e}")
        print(traceback.format_exc())
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False)  # Disable debug for production
