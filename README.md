# Portfolio.AI

An AI-powered portfolio and resume generator with interactive 3D visualizations.

## Features

- **AI-Powered Portfolio Generation**
  - Interactive 3D visualization
  - Customizable themes
  - Responsive design

- **Resume Builder**
  - Multiple professional templates
  - Drag-and-drop section editor
  - Real-time preview
  - Export options (PDF, Web)

- **Interactive Elements**
  - 3D model integration
  - Dynamic content updates
  - Custom animations

## Project Structure
Portfolio.AI/
├── app.py                  # Flask application
├── requirements.txt        # Python dependencies
├── static/                 # Static files
│   ├── js/
│   │   ├── main.js        # Form handling and 3D visualization
│   │   ├── portfolio.js   # Portfolio page 3D visualization
│   │   └── resume_editor.js # Resume editor functionality
│   └── images/            # Image assets
│       └── resume/        # Resume template previews
├── templates/             # HTML templates
│   ├── index.html         # Main form page
│   ├── portfolio.html     # Generated portfolio page
│   ├── resume_templates.html # Resume template selection
│   └── resume_editor_professional.html # Professional resume editor
└── uploads/              # Uploaded images and data storage

## Setup Instructions
1. Install Python 3.8 or higher
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Open http://localhost:5000 in your web browser

## Usage
1. **Create Portfolio**
   - Fill out the portfolio form
   - Choose a theme
   - Add your experiences and projects
   - Generate your 3D portfolio

2. **Build Resume**
   - Click "Create Resume" on your portfolio
   - Choose a template
   - Add your information
   - Preview and export

## Technologies Used
- Backend: Flask (Python)
- Frontend: HTML, JavaScript, Three.js
- Styling: Tailwind CSS
- 3D Graphics: Three.js
