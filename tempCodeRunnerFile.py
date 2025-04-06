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
    analysis_type = request.json.get('type', 'summary')
    
    try:
        if analysis_type == 'summary':
            app.logger.info(os.environ.get("OPENAI_API_KEY"))
            return generate_summary(paper_text)
        elif analysis_type == 'key_insights':
            return extract_key_insights(paper_text)
        elif analysis_type == 'related_work':
            return suggest_related_work(paper_text)
        elif analysis_type == 'questions':
            return generate_questions(paper_text)
        else:
            return jsonify({"error": "Invalid analysis type"}), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def generate_summary(paper_text):
    """Generate a concise summary of the paper."""
    try:
        # Truncate text if it's too long
        max_length = 15000  # OpenAI model context limit (adjust as needed)
        truncated_text = paper_text[:max_length] if len(paper_text) > max_length else paper_text
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a research assistant that specializes in academic paper summarization. Provide a clear, concise summary focusing on the main contributions, methodology, and results."},
                {"role": "user", "content": f"Summarize the following research paper in 3-4 paragraphs:\n\n{truncated_text}"}
            ],
            temperature=0.3,
            max_tokens=800
        )
        
        summary = response.choices[0].message.content
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": f"Error generating summary: {str(e)}"}), 500

def extract_key_insights(paper_text):
    """Extract key insights and contributions from the paper."""
    try:
        # Truncate if needed
        max_length = 15000
        truncated_text = paper_text[:max_length] if len(paper_text) > max_length else paper_text
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a research analyst specializing in identifying the key contributions and insights from academic papers."},
                {"role": "user", "content": f"Extract the 5-7 most important insights, contributions or findings from this paper. Format as a bullet point list:\n\n{truncated_text}"}
            ],
            temperature=0.3,
            max_tokens=800
        )
        
        insights = response.choices[0].message.content
        return jsonify({"key_insights": insights})
    except Exception as e:
        return jsonify({"error": f"Error extracting insights: {str(e)}"}), 500

def suggest_related_work(paper_text):
    """Suggest related papers based on the content."""
    try:
        max_length = 10000
        truncated_text = paper_text[:max_length] if len(paper_text) > max_length else paper_text
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a research librarian who recommends related academic papers."},
                {"role": "user", "content": f"Based on the following paper, suggest 5 related papers or research directions that would complement this work. Include paper titles, authors if known, and brief explanations of why they're relevant:\n\n{truncated_text}"}
            ],
            temperature=0.5,
            max_tokens=800
        )
        
        related_work = response.choices[0].message.content
        return jsonify({"related_work": related_work})
    except Exception as e:
        return jsonify({"error": f"Error suggesting related work: {str(e)}"}), 500

def generate_questions(paper_text):
    """Generate discussion questions based on the paper."""
    try:
        max_length = 10000
        truncated_text = paper_text[:max_length] if len(paper_text) > max_length else paper_text
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professor guiding a research discussion."},
                {"role": "user", "content": f"Generate 5 thoughtful discussion questions based on this paper. These questions should explore implications, limitations, and potential future work:\n\n{truncated_text}"}
            ],
            temperature=0.7,
            max_tokens=600
        )
        
        questions = response.choices[0].message.content
        return jsonify({"questions": questions})
    except Exception as e:
        return jsonify({"error": f"Error generating questions: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(port=3000)
