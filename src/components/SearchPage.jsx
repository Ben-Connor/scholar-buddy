import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { searchPapers } from "../api/paperApi";
import PaperCard from "./PaperCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("regular"); // Add state for mode selection
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const results = await searchPapers(query);
      setPapers(results);
    } catch (err) {
      setError("Failed to search papers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaperClick = (paperId) => {
    // Navigate to the PaperPage with the selected mode as a query parameter
    navigate(`/paper/${paperId}?mode=${mode}`);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for papers..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {/* Mode Selection */}
      <div className="mode-selection">
        <label>
          <input
            type="radio"
            name="mode"
            value="regular"
            checked={mode === "regular"}
            onChange={(e) => setMode(e.target.value)}
          />
          Regular
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="explained"
            checked={mode === "explained"}
            onChange={(e) => setMode(e.target.value)}
          />
          Explained
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="simplified"
            checked={mode === "simplified"}
            onChange={(e) => setMode(e.target.value)}
          />
          Simplified
        </label>
      </div>

      {loading && <div>Searching...</div>}
      {error && <div className="error-message">{error}</div>}

      {papers.length > 0 ? (
        <ul className="papers-list">
          {papers.map((paper, index) => (
            <li
              key={paper.paperId}
              onClick={() => handlePaperClick(paper.paperId)}
              className="paper-item"
              style={{
                animationDelay: `${index * 0.1}s`, // Add delay for staggered animation
              }}
            >
              <PaperCard paper={paper} />
            </li>
          ))}
        </ul>
      ) : (
        !loading && <div>No papers found</div>
      )}
    </div>
  );
}