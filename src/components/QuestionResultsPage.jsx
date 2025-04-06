import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/QuestionResults.css';

function QuestionResults() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResults = localStorage.getItem('questionResults');
    if (!storedResults) {
      setError('No results found. Please try a new search.');
      setLoading(false);
      return;
    }

    try {
      const parsedResults = JSON.parse(storedResults);
      if (!parsedResults.question || !parsedResults.papers) {
        throw new Error('Incomplete results data');
      }
      setResults(parsedResults);
    } catch (err) {
      console.error('Error parsing results:', err);
      setError('Failed to load results.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Format consensus for display
  const formatConsensus = (text) => {
    if (!text) {
      console.log("Consensus text is empty or undefined");
      return { __html: "<p>No consensus data available.</p>" };
    }
    
    console.log("Formatting consensus of length:", text.length);
    
    // Replace markdown with HTML
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
      
    return { __html: formattedText };
  };

  // Add a debug function
  const debugData = () => {
    const rawData = localStorage.getItem('questionResults');
    console.log("Raw localStorage data:", rawData);
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        console.log("Parsed data:", parsed);
        console.log("Has consensus:", Boolean(parsed.consensus));
      } catch (e) {
        console.error("Parse error:", e);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading research results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={debugData}>Debug Data</button>
        <Link to="/" className="back-link">Return to search</Link>
      </div>
    );
  }

  return (
    <div className="question-results-container">
      {/* Debug button */}
      <button 
        onClick={debugData} 
        style={{ 
          position: 'absolute', 
          top: '10px', 
          right: '10px',
          padding: '5px',
          background: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Debug
      </button>

      <div className="question-header">
        <h1 className="question-title">{results.question}</h1>
        <p className="search-terms">
          <small>Search terms: {results.search_terms}</small>
        </p>
      </div>
      
      <div className="analysis-panel">
        <h2>Research Consensus</h2>
        {results.consensus ? (
          <div 
            className="consensus-content"
            dangerouslySetInnerHTML={formatConsensus(results.consensus)}
          />
        ) : (
          <p>No consensus data available for this question.</p>
        )}
      </div>
      
      <div className="supporting-papers">
        <h2>Supporting Research Papers</h2>
        {results.papers && results.papers.length > 0 ? (
          <div className="papers-list">
            {results.papers.map((paper, index) => (
              <div key={index} className="paper-card">
                <h3 className="paper-title">{paper.title || "Untitled Paper"}</h3>
                <p className="paper-authors">
                  {Array.isArray(paper.authors) 
                    ? paper.authors.map(a => 
                        typeof a === 'string' ? a : (a.name || 'Unknown')
                      ).join(', ') 
                    : 'Unknown authors'} 
                  ({paper.year || 'N/A'})
                </p>
                <p className="paper-excerpt">{paper.excerpt || paper.abstract || 'No abstract available'}</p>
                {paper.url && (
                  <a 
                    href={paper.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="paper-link"
                  >
                    View Paper
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No supporting papers found.</p>
        )}
      </div>
      
      <div className="back-link-container">
        <Link to="/" className="back-link">Ask another question</Link>
      </div>
    </div>
  );
}

export default QuestionResults;
