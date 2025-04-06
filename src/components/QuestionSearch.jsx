import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/QuestionSearch.css'; // Make sure this CSS file exists

function QuestionSearch() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/process-question', { question });
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      localStorage.setItem('questionResults', JSON.stringify(response.data));
      navigate('/question-results');
    } catch (error) {
      console.error('Error processing question:', error);
      alert('Failed to process your question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="question-search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a research question..."
          className="search-input"
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Find Answers'}
        </button>
      </form>
      
      <div className="example-questions">
        <h3>Try these examples:</h3>
        <div className="example-question-list">
          <div 
            className="example-question-tag"
            onClick={() => setQuestion('Does intermittent fasting help with weight loss?')}
          >
            Does intermittent fasting help with weight loss?
          </div>
          <div 
            className="example-question-tag"
            onClick={() => setQuestion('Can meditation reduce anxiety?')}
          >
            Can meditation reduce anxiety?
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionSearch;

// Add this function to your QuestionSearch component
const testWithDummyData = () => {
    const dummyData = {
      question: "Does meditation reduce anxiety?",
      search_terms: "meditation, anxiety, reduction, mindfulness",
      papers: [
        {
          id: "test1",
          title: "Effects of Meditation on Anxiety",
          authors: ["Smith, J.", "Johnson, M."],
          year: "2021",
          excerpt: "This study found that regular meditation practice significantly reduced anxiety symptoms in participants over an 8-week period."
        },
        {
          id: "test2",
          title: "Mindfulness-Based Stress Reduction",
          authors: ["Brown, A."],
          year: "2020",
          excerpt: "MBSR techniques were shown to lower cortisol levels and self-reported anxiety in clinical populations."
        }
      ],
      consensus: "**Scientific Consensus:**\nMultiple studies indicate that regular meditation practice can significantly reduce anxiety symptoms. The most robust effects are seen with consistent practice over 8+ weeks.\n\n**Major findings:**\n- Meditation reduces symptoms of generalized anxiety disorder (Paper 1)\n- Mindfulness techniques lower physiological markers of stress (Paper 2)\n- Effects are comparable to some pharmacological interventions (Paper 1)\n\n**Practical implications:**\nFor someone looking to reduce anxiety, starting with just 10-15 minutes of daily meditation practice could provide meaningful benefits within 2 months."
    };
    
    // Store in localStorage
    localStorage.setItem('questionResults', JSON.stringify(dummyData));
    console.log("Stored dummy data in localStorage");
    
    // Navigate to results page
    navigate('/question-results');
  };
  
  // Then add a small test button somewhere in your component
  <button 
    onClick={testWithDummyData}
    style={{ marginTop: '10px', padding: '5px 10px' }}
  >
    Test with Example
  </button>
