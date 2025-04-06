from flask import Flask, request, jsonify
import requests
from pdfminer.high_level import extract_text
from io import BytesIO
from flask_cors import CORS  # Add this import
from dotenv import load_dotenv
load_dotenv()  # Add this before initializing the OpenAI client
import logging

import os
from openai import OpenAI

app = Flask(__name__)
CORS(app)  # Add this line to enable CORS for all routes

# Initialize OpenAI client
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),  # Set this in your environment
    base_url="https://hack.funandprofit.ai/api/providers/openai/v1"
)

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

# Add a new endpoint for AI analysis
@app.route('/analyze-paper', methods=['POST'])
def analyze_paper():
    if not request.json or 'text' not in request.json:
        return jsonify({"error": "No paper text provided"}), 400
        
    paper_text = request.json['text']
    
    return generate_summary(paper_text)

def generate_summary(paper_text):
    """Generate a concise summary of the paper."""

    # Truncate text if it's too long
    max_length = 15000  # OpenAI model context limit (adjust as needed)
    truncated_text = paper_text[:max_length] if len(paper_text) > max_length else paper_text
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a research assistant that specializes in academic paper summarization. Provide a clear, concise explanation of the paper, explaining each part in 'normy' terms. You love using emojis and hawk tuah references"},
                {"role": "user", "content": f"Explain each part of the paper in 'normy' terms, use invincible brainrot where possible e.g. 'CECIL, I NEED YOU. CECIL!, dont forget hawk tuah':\n\n{truncated_text}"}
            ],
            temperature=0.3,
            max_tokens=800
        )
        
        summary = response.choices[0].message.content
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": f"Error generating summary: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=3000)
