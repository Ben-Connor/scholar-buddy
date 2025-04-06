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
@app.route('/parse-paper', methods=['POST'])
def analyze_paper():
    if not request.json or 'text' not in request.json or 'mode' not in request.json:
        return jsonify({"error": "No paper text or mode provided"}), 400

    paper_text = request.json['text']
    mode = request.json['mode']

    if mode not in ['regular', 'explained', 'simplified']:
        return jsonify({"error": "Invalid mode. Choose 'regular', 'explained', or 'simplified'"}), 400

    return generate_summary(paper_text, mode)

@app.route('/explain-highlight', methods=['POST'])
def explain_highlight():
    """
    Endpoint to explain highlighted text based on the user's mode.
    """
    if not request.json or 'text' not in request.json or 'mode' not in request.json:
        return jsonify({"error": "No highlighted text or mode provided"}), 400

    highlighted_text = request.json['text']
    mode = request.json['mode']

    if mode not in ['regular', 'explained', 'simplified']:
        return jsonify({"error": "Invalid mode. Choose 'regular', 'explained', or 'simplified'"}), 400

    # Define prompts for each mode
    prompts = {
        "regular": "Provide a concise, professional explanation of the highlighted text in academic terms.",
        "explained": "Explain the highlighted text in simple terms for someone familiar with the field but who struggles with complex concepts. Use examples and analogies where possible.",
        "simplified": "Simplify the highlighted text to its most basic ideas, avoiding technical jargon and making it understandable for someone new to the field."
    }

    try:
        # Commented out the OpenAI API call
        # response = client.chat.completions.create(
        #     model="o3-mini-2025-01-31",
        #     messages=[
        #         {"role": "system", "content": "You are a research assistant specializing in explaining academic concepts."},
        #         {"role": "user", "content": f"{prompts[mode]}:\n\n{highlighted_text}"}
        #     ],
        #     max_completion_tokens=500
        # )

        # explanation = response.choices[0].message.content

        # Default responses for each mode
        default_responses = {
            "regular": "This is a concise, professional explanation of the highlighted text.",
            "explained": "This is an explanation of the highlighted text in simple terms with examples and analogies.",
            "simplified": "This is a simplified explanation of the highlighted text, avoiding technical jargon."
        }

        explanation = default_responses[mode]
        return jsonify({"explanation": explanation})
    except Exception as e:
        return jsonify({"error": f"Error generating explanation: {str(e)}"}), 500

def generate_summary(paper_text, mode):
    """Generate a cleaned-up and mode-specific summary of the paper using AI."""
    
    # Define prompts for each mode
    prompts = {
        "regular": "Provide a concise, professional summary of the following academic paper in academic terms.",
        "explained": "Explain the following academic paper in simple terms for someone familiar with the field but who struggles with complex concepts. Use examples and analogies where possible.",
        "simplified": "Simplify the following academic paper to its most basic ideas, avoiding technical jargon and making it understandable for someone new to the field."
    }

    if mode not in prompts:
        return jsonify({"error": "Invalid mode. Choose 'regular', 'explained', or 'simplified'"}), 400

    try:
        # Commented out the OpenAI API call
        # response = client.chat.completions.create(
        #     model="o3-mini-2025-01-31",
        #     messages=[
        #         {"role": "system", "content": "You are a research assistant specializing in summarizing academic papers."},
        #         {"role": "user", "content": f"{prompts[mode]}:\n\n{paper_text}"}
        #     ],
        #     max_completion_tokens=500
        # )

        # summary = response.choices[0].message.content

        # Default responses for each mode
        default_responses = {
            "regular": "This is a concise, professional summary of the academic paper.",
            "explained": "This is an explanation of the academic paper in simple terms with examples and analogies.",
            "simplified": "This is a simplified version of the academic paper, avoiding technical jargon."
        }

        summary = default_responses[mode]
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": f"Error generating summary: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)
