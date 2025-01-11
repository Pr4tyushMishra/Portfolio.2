import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def handler(event, context):
    try:
        # Parse the incoming request
        body = json.loads(event['body'])
        
        # Your resume generation logic here
        # This is a placeholder - replace with actual logic from app.py
        result = {
            "status": "success",
            "message": "Resume generated successfully",
            "data": body  # Echo back the input for demonstration
        }
        
        return {
            'statusCode': 200,
            'body': json.dumps(result),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'status': 'error',
                'message': str(e)
            }),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }

# For local testing
if __name__ == "__main__":
    app.run(debug=True)
