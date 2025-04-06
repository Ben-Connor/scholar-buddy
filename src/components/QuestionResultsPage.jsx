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
      return { __html: "<p>No consensus data available.</p>" };
    }

    // Replace markdown with HTML
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');

    return { __html: formattedText };
  };

  // Handle click on a paper card
  const handlePaperClick = (paperId) => {
    // Extract the paper ID if it's a full URL
    const extractedId = paperId.includes("http") ? paperId.split("/").pop() : paperId;
    navigate(`/paper/${extractedId}`);
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
        <Link to="/" className="back-link">Return to search</Link>
      </div>
    );
  }

  return (
    <div className="question-results-container">
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
              <div
                key={index}
                className="paper-card"
                onClick={() => handlePaperClick(paper.id)} // Updated function
                style={{ cursor: 'pointer' }}
              >
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
