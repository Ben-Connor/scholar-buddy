import { useState } from 'react';
import axios from 'axios';  // Import Axios for HTTP requests
import './App.css';

function App() {
  // Step 1: Create state variables
  const [searchTerm, setSearchTerm] = useState('');  // Default to Physics as topic
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Step 2: Handle input change to update state with user input
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Step 3: Handle form submission to search papers
  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent form from refreshing the page
    setLoading(true);
    setError('');
    try {
      // Make the request to Semantic Scholar API
      const response = await axios.get(`https://api.semanticscholar.org/graph/v1/paper/search`, {
        params: {
          query: searchTerm,  // Search term (could be a topic like 'Physics')
          limit: 5,
          fields: 'title,authors,year,paperId'  // Explicitly request these fields
        }
      });
      
      console.log("API Response:", response.data);  // Log the full response to examine the structure
      console.log("Paper authors:", response.data.data ? response.data.data.map(paper => paper.authors) : []);
      
      // Check if the response contains the expected data
      if (response.data && response.data.data) {
        setPapers(response.data.data);
      } else {
        setError('No data found in response.');
      }
    } catch (err) {
      // Handle any errors from the API
      setError(`An error occurred while fetching the papers: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      <h1>Scholar Buddy</h1>
      <div className="card">
        <p>Welcome to Scholar Buddy</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="search">Search for Topic: </label>
          <input
            type="text"
            id="search"
            name="search"
            value={searchTerm}  // Bind the input value to state
            onChange={handleInputChange}  // Update state when input changes
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i> {/* FontAwesome search icon */}
          </button>
        </form>
        
        {/* Display loading message or error */}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {/* Display search results */}
        <div>
          {papers.length > 0 ? (
            <ul>
              {papers.map((paper) => (
                <li key={paper.paperId}>
                  <a href={`https://www.semanticscholar.org/paper/${paper.paperId}`} target="_blank" rel="noopener noreferrer">
                    {paper.title}
                  </a>
                  {/* Updated authors handling */}
                  <p>
                    {paper.authors && paper.authors.length > 0
                      ? paper.authors.map(author => author.name || 'Unknown').join(', ')
                      : 'No authors available'}
                  </p>
                  <p>{paper.year}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No papers found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;