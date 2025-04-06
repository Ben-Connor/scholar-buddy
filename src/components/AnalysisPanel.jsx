import { useState } from "react";
import axios from "axios";
import handleClickText from "../utils/highlight"; // Import the highlight hook

const AnalysisPanel = ({ pdfText }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use the custom hook to get the selected word
  const selectedText = handleClickText();

  const analyzeText = async () => {
    if (!pdfText || pdfText.trim() === '') {
      setError('Please extract paper text first');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log("Sending paper for analysis...");
      const response = await axios.post('http://localhost:3000/analyze-paper', {
        text: pdfText
      });
      
      console.log("Analysis response:", response.data);
      setResult(response.data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to analyze paper');
    } finally {
      setLoading(false);
    }
  };

  const analyzeHighlightedText = async () => {
    if (!selectedText || selectedText.trim() === '') {
      setError('Please highlight some text first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Sending highlighted text for analysis...");
      const response = await axios.post('http://localhost:3000/analyze-paper', {
        text: selectedText
      });

      console.log("Analysis response:", response.data);
      setResult(response.data);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to analyze highlighted text');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;
    
    return (
        <div className="analysis-result">
          <h3>Highlighted Text Explanation</h3>
          <div className="summary-text">{result.summary}</div>
        </div>
    );
  }

  return (
    <div className="analysis-panel" style={{
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      padding: "20px",
      marginTop: "20px"
    }}>
      <h2>AI Research Assistant</h2>
      
      <div style={{
        display: "flex", 
        gap: "15px",
        marginBottom: "20px",
        alignItems: "center"
      }}>
        
        <button 
          onClick={analyzeText}
          disabled={loading || !pdfText}
          style={{
            backgroundColor: "#2c7fb8",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "4px",
            cursor: loading || !pdfText ? "not-allowed" : "pointer",
            opacity: loading || !pdfText ? 0.6 : 1
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze Paper'}
        </button>

        <button
          onClick={analyzeHighlightedText}
          disabled={loading || !selectedText}
          style={{
            backgroundColor: "#2c7fb8",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "4px",
            cursor: loading || !selectedText ? "not-allowed" : "pointer",
            opacity: loading || !selectedText ? 0.6 : 1,
          }}
        >
          {loading ? "Analyzing..." : "Analyze Highlighted Text"}
        </button>
      </div>
      
      {error && (
        <div style={{
          backgroundColor: "#fff1f0",
          color: "#cf1322",
          padding: "10px",
          borderRadius: "4px",
          margin: "10px 0"
        }}>
          {error}
        </div>
      )}
      
      {loading && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "20px 0"
        }}>
          <p>Analyzing highlighted text, please wait...</p>
          <div style={{
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #2c7fb8",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            animation: "spin 1s linear infinite"
          }}></div>
        </div>
      )}
      
      {result && (
        <div style={{
          backgroundColor: "#f8f8f8",
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "15px",
          marginTop: "20px"
        }}>
          {renderResult()}
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
