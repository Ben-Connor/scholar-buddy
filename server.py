from flask import Flask, request, jsonify
import requests
from pdfminer.high_level import extract_text
from io import BytesIO
from flask_cors import CORS  # Add this import

app = Flask(__name__)
CORS(app)  # Add this line to enable CORS for all routes

@app.route('/extract-text', methods=['POST'])
def extract_text_from_pdf():
    if 'url' in request.json:
        # Handle URL-based PDF fetching
        try:
            pdf_response = requests.get(request.json['url'])
            pdf_response.raise_for_status()
            pdf_text = extract_text(BytesIO(pdf_response.content))
            return jsonify({'text': pdf_text})
        except Exception as e:
            return f"Error fetching or processing PDF from URL: {str(e)}", 500
    elif 'pdfFile' in request.files:
        # Handle file upload
        try:
            pdf_file = request.files['pdfFile']
            pdf_text = extract_text(pdf_file)
            return jsonify({'text': pdf_text})
        except Exception as e:
            return f"Error processing PDF file: {str(e)}", 500
    else:
        return "No PDF file uploaded or URL provided.", 400

if __name__ == '__main__':
    app.run(port=3000)
