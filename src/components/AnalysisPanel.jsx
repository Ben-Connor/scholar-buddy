import { useState } from "react";
import axios from "axios";

const AnalysisPanel = ({ pdfText }) => {
  const [analysisType, setAnalysisType] = useState('summary');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        text: pdfText,
        type: analysisType
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

  const renderResult = () => {
    if (!result) return null;
    
    // Handle different result types
    if (result.summary) {
      return (
        <div className="analysis-result">
          <h3>Paper Summary</h3>
          <div className="summary-text">{result.summary}</div>
        </div>
      );
    } else if (result.key_insights) {
      return (
        <div className="analysis-result">
          <h3>Key Insights</h3>
          <div className="insights-text">{result.key_insights}</div>
        </div>
      );
    } else if (result.related_work) {
      return (
        <div className="analysis-result">
          <h3>Related Work</h3>
          <div className="related-work-text">{result.related_work}</div>
        </div>
      );
    } else if (result.questions) {
      return (
        <div className="analysis-result">
          <h3>Discussion Questions</h3>
          <div className="questions-text">{result.questions}</div>
        </div>
      );
    }
    
    return <div>Unknown result type</div>;
  };

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
        <div style={{flexGrow: 1}}>
          <label htmlFor="analysis-type" style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "500"
          }}>Analysis Type:</label>
          <select 
            id="analysis-type"
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          >
            <option value="summary">Generate Summary</option>
            <option value="key_insights">Extract Key Insights</option>
            <option value="related_work">Suggest Related Work</option>
            <option value="questions">Generate Discussion Questions</option>
          </select>
        </div>
        
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
          <p>Analyzing paper, please wait...</p>
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
