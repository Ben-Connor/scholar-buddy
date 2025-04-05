// src/components/PaperAnalysis.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPaperDetails } from "../api/paperApi";
import axios from "axios";

export default function PaperAnalysis() {
  const { paperId } = useParams();
  const [paper, setPaper] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState({
    paper: true,
    pdfText: false,
    analysis: false
  });
  const [error, setError] = useState(null);

  // Fetch paper details and text
  useEffect(() => {
    async function loadPaperData() {
      try {
        // Get paper details
        const data = await getPaperDetails(paperId);
        setPaper(data);
        setLoading(prev => ({ ...prev, paper: false }));
        
        // If PDF URL exists, fetch PDF text
        if (data.pdfUrl) {
          await fetchPdfText(data.pdfUrl);
        }
      } catch (err) {
        setError("Failed to load paper details");
        setLoading(prev => ({ ...prev, paper: false }));
      }
    }

    loadPaperData();
  }, [paperId]);
  
  // Function to fetch PDF text from Flask backend
  async function fetchPdfText(url) {
    try {
      setLoading(prev => ({ ...prev, pdfText: true }));
      
      // Call your Flask API to extract text
      const response = await axios.post("http://localhost:3000/extract-text", {
        url: url
      });
      
      setPdfText(response.data.text);
      setLoading(prev => ({ ...prev, pdfText: false }));
      
    } catch (err) {
      console.error("Failed to extract PDF text:", err);
      setLoading(prev => ({ ...prev, pdfText: false }));
    }
  }
  
  // Function to generate AI analysis
  async function generateAnalysis() {
    try {
      setLoading(prev => ({ ...prev, analysis: true }));
      
      // This would call your AI API endpoint
      // For now, we'll use a placeholder
      // Implement real AI integration later
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Placeholder analysis text
      const placeholderAnalysis = `
# Analysis of "${paper.title}"

## Summary
This paper presents a novel approach to problems in ${paper.fieldsOfStudy?.[0] || 'its field'}. The authors demonstrate a method for improving results compared to previous work.

## Key Contributions
1. A new framework for understanding the problem
2. Experimental results showing improvement over baselines
3. Theoretical analysis of the approach's properties

## Methodology
The authors employ a rigorous methodology including data collection, model development, and extensive evaluation. Their approach combines elements from multiple disciplines.

## Critical Analysis
Strengths:
- Clear presentation of ideas
- Thorough experimental validation
- Addresses an important problem in the field

Limitations:
- Limited evaluation on diverse datasets
- Some assumptions might not hold in all scenarios
- Computational requirements could be prohibitive for some applications

## Future Directions
This work opens up several interesting avenues for future research:
- Extending the approach to related domains
- Improving efficiency of the proposed methods
- Combining with complementary approaches
`;
      
      setAnalysis(placeholderAnalysis);
      
    } catch (err) {
      console.error("Failed to generate analysis:", err);
    } finally {
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  }

  if (loading.paper) return <div>Loading paper details...</div>;
  if (error) return <div>{error}</div>;
  if (!paper) return <div>Paper not found</div>;

  return (
    <div className="paper-analysis" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1>Analysis: {paper.title}</h1>
      
      <div className="paper-metadata" style={{ marginBottom: '20px' }}>
        <p>
          <strong>Authors:</strong>{" "}
          {paper.authors?.length
            ? paper.authors.map((a, index) => (
                <span key={index}>{a.name || 'Unknown'}{index < paper.authors.length - 1 ? ', ' : ''}</span>
              ))
            : 'No authors available'}
        </p>
        <p><strong>Year:</strong> {paper.year}</p>
        {paper.fieldsOfStudy?.length > 0 && (
          <p><strong>Field:</strong> {paper.fieldsOfStudy.join(', ')}</p>
        )}
      </div>
      
      {/* PDF Text Status */}
      <div className="pdf-status" style={{ marginBottom: '20px' }}>
        {loading.pdfText ? (
          <div style={{ padding: '15px', backgroundColor: '#808080', borderRadius: '4px' }}>
            Extracting text from PDF... This may take a moment.
          </div>
        ) : pdfText ? (
          <div style={{ padding: '15px', backgroundColor: '#808080', borderRadius: '4px' }}>
            ✓ PDF text extracted ({Math.round(pdfText.length / 1000)}K characters)
          </div>
        ) : paper.pdfUrl ? (
          <div style={{ padding: '15px', backgroundColor: '#808080', borderRadius: '4px' }}>
            PDF text extraction pending. Click "Extract Text" to begin.
          </div>
        ) : (
          <div style={{ padding: '15px', backgroundColor: '#808080', borderRadius: '4px' }}>
            No PDF available for this paper.
          </div>
        )}
      </div>
      
      {/* Analysis Actions */}
      <div className="analysis-actions" style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        {paper.pdfUrl && !pdfText && !loading.pdfText && (
          <button 
            onClick={() => fetchPdfText(paper.pdfUrl)}
            style={{
              padding: '10px 15px',
              backgroundColor: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Extract Text
          </button>
        )}
        
        {pdfText && !analysis && !loading.analysis && (
          <button 
            onClick={generateAnalysis}
            style={{
              padding: '10px 15px',
              backgroundColor: '#9b59b6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Generate AI Analysis
          </button>
        )}
        
        <Link 
          to={`/paper/${paperId}`}
          style={{
            padding: '10px 15px',
            backgroundColor: '#3498db',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none'
          }}
        >
          Back to Paper
        </Link>
      </div>
      
      {/* Analysis Results */}
      <div className="analysis-results">
        {loading.analysis ? (
          <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <p>Generating AI analysis... This may take a minute.</p>
            {/* Add a spinner here */}
          </div>
        ) : analysis ? (
          <div className="analysis-content" style={{ 
            backgroundColor: 'grey', 
            padding: '25px',
            borderRadius: '6px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            {analysis.split('\n').map((line, index) => {
              // Simple Markdown-like rendering
              if (line.startsWith('# ')) {
                return <h1 key={index} style={{ fontSize: '26px', marginTop: '20px' }}>{line.substring(2)}</h1>;
              } else if (line.startsWith('## ')) {
                return <h2 key={index} style={{ fontSize: '22px', marginTop: '20px', color: '#444' }}>{line.substring(3)}</h2>;
              } else if (line.match(/^[0-9]+\. /)) { 
                // List item matcher (e.g. "1. ", "2. ")
                return <div key={index} style={{ marginLeft: '20px', marginBottom: '8px' }}>• {line.substring(line.indexOf(' ') + 1)}</div>;
              } else if (line.startsWith('- ')) {
                return <div key={index} style={{ marginLeft: '20px', marginBottom: '8px' }}>• {line.substring(2)}</div>;
              } else {
                return line ? <p key={index} style={{ marginBottom: '10px', lineHeight: '1.6' }}>{line}</p> : <br key={index} />;
              }
            })}
          </div>
        ) : null}
      </div>
      
      {/* PDF Preview (Optional, collapsed by default) */}
      {pdfText && (
        <div className="pdf-preview" style={{ marginTop: '30px' }}>
          <details>
            <summary style={{ cursor: 'pointer', padding: '10px', backgroundColor: '#808080', borderRadius: '4px' }}>
              View Extracted PDF Text
            </summary>
            <div style={{ 
              maxHeight: '300px', 
              overflowY: 'auto',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginTop: '10px',
              backgroundColor: '#808080',
              fontSize: '14px'
            }}>
              {pdfText.split('\n\n').map((paragraph, index) => (
                paragraph.trim() ? (
                  <p key={index} style={{ marginBottom: '15px' }}>{paragraph}</p>
                ) : null
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
