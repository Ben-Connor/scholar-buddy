from flask import Flask, request, jsonify
import requests
from pdfminer.high_level import extract_text
from io import BytesIO
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()

import os
from openai import OpenAI

app = Flask(__name__)
CORS(app)

# Initialize OpenAI client
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
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
    "regular": (
        "Clean up the text by fixing formatting issues"
        "Keep the original wording and structure as intact as possible. Do not rewrite unless necessary. "
        "Output the cleaned version in well-formatted, readable Markdown."
    ),
    "explained": (
        "Clean up the text by fixing formatting issues"
        "Clarify complex terms and concepts using simple language, analogies, or examples. "
        "Assume the reader has some background in the field but finds dense or technical text challenging. "
        "Maintain the core content and structure. Output in clear, well-organized Markdown format."
        "Make it no more 100 words."
    ),
    "simplified": (
        "Clean up the text by fixing formatting issues"
        "Rewrite the highlighted text using plain, simple language for a beginner. "
        "Avoid jargon, focus on the key ideas, and make it easy to understand. "
        "Output in clean, readable Markdown format."
    )
    }

    try:
        response = client.chat.completions.create(
            model="o3-mini-2025-01-31",
            messages=[
                {"role": "system", "content": "You are a research assistant specializing in explaining academic concepts."},
                {"role": "user", "content": f"{prompts[mode]}:\n\n{highlighted_text}"}
            ],
            max_completion_tokens=5000
        )

        explanation = response.choices[0].message.content
        return jsonify({"explanation": explanation})
    except Exception as e:
        return jsonify({"error": f"Error generating explanation: {str(e)}"}), 500

def parse_arxiv_response(response_text):
    """
    Parse the XML response from arXiv and extract relevant fields.
    """
    import xml.etree.ElementTree as ET
    papers = []
    try:
        root = ET.fromstring(response_text)
        for entry in root.findall('{http://www.w3.org/2005/Atom}entry'):
            paper = {
                'id': entry.find('{http://www.w3.org/2005/Atom}id').text,
                'title': entry.find('{http://www.w3.org/2005/Atom}title').text,
                'abstract': entry.find('{http://www.w3.org/2005/Atom}summary').text,
                'authors': [author.find('{http://www.w3.org/2005/Atom}name').text for author in entry.findall('{http://www.w3.org/2005/Atom}author')],
                'year': entry.find('{http://arxiv.org/schemas/atom}published').text[:4] if entry.find('{http://arxiv.org/schemas/atom}published') is not None else 'Unknown'
            }
            papers.append(paper)
    except Exception as e:
        print(f"Error parsing arXiv response: {e}")
        return []  # Return an empty list or handle the error as needed
    return papers

def search_papers(query):
    """
    Search arXiv for papers based on the query.
    """
    try:
        response = requests.get(
            "http://export.arxiv.org/api/query",
            params={
                "search_query": f"all:{query}",
                "start": 0,
                "max_results": 10,
                "sortBy": "relevance",
                "sortOrder": "descending"
            }
        )
        response.raise_for_status()
        # Parse XML response and extract relevant fields
        # (Use the same logic as in src/api/paperApi.js)
        return parse_arxiv_response(response.text)
    except Exception as e:
        print(f"Error searching arXiv: {e}")
        return []

def generate_summary(paper_text, mode):
    """Generate a cleaned-up and mode-specific summary of the paper using AI."""
    
    # Define prompts for each mode
    prompts = {
        "regular": "Literally just say x",
        "simplified": "Simplify the following academic paper to its most basic ideas, avoiding technical jargon and making it understandable for someone new to the field."
    }

    if mode not in prompts:
        return jsonify({"error": "Invalid mode. Choose 'regular', 'explained', or 'simplified'"}), 400

    try:
        response = client.chat.completions.create(
            model="o3-mini-2025-01-31",
            messages=[
                {"role": "system", "content": "You are a research assistant specializing in summarizing academic papers."},
                {"role": "user", "content": f"{prompts[mode]}:\n\n{paper_text}"}
            ],
            max_completion_tokens=2000
        )

        summary = response.choices[0].message.content
        return jsonify({"summary": summary})
    except Exception as e:
        return jsonify({"error": f"Error generating summary: {str(e)}"}), 500

@app.route('/process-question', methods=['POST'])
def process_question():
    if 'question' not in request.json:
        return jsonify({"error": "No question provided"}), 400
        
    question = request.json['question']
    
    # Generate search terms from the question
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Extract key search terms from this research question. Return only 3-5 relevant keywords or phrases separated by commas, with no additional text."},
                {"role": "user", "content": question}
            ],
            temperature=0.3,
            max_tokens=100
        )
        
        search_terms = response.choices[0].message.content
        # Remove any extra formatting like numbering
        search_terms = search_terms.replace('\n', '').strip()
        
        # Use our Python implementation instead of the JS import
        papers = search_papers(search_terms)
        
        # Limit to top 5 most relevant papers
        top_papers = papers[:5]
        
        # Extract relevant content from papers
        paper_excerpts = []
        for paper in top_papers:
            # If you already have the paper content:
            excerpt = paper.get('abstract', '')[:1000]  # Use abstract if available
            paper_excerpts.append({
                "id": paper.get('id', ''),
                "title": paper.get('title', ''),
                "excerpt": excerpt,
                "authors": paper.get('authors', []),
                "year": paper.get('year', '')
            })
        
        # Generate consensus answer
        consensus = generate_consensus(question, paper_excerpts)
        
        return jsonify({
            "question": question,
            "search_terms": search_terms,
            "papers": paper_excerpts,
            "consensus": consensus
        })
        
    except Exception as e:
        return jsonify({"error": f"Error processing question: {str(e)}"}), 500

def generate_consensus(question, paper_excerpts):
    """
    Generate a consensus answer using OpenAI API.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Generate a scientific consensus based on the provided paper excerpts."},
                {"role": "user", "content": f"Question: {question}\n\nPaper excerpts:\n{paper_excerpts}"}
            ],
            temperature=0.5,
            max_tokens=800
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error generating consensus: {e}"


if __name__ == '__main__':
    app.run(port=3000, debug=True)
