import { useState } from "react";
import { searchPapers } from "../api/paperApi";
import PaperCard from "./PaperCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      {loading && <div>Searching...</div>}
      {error && <div className="error-message">{error}</div>}

      {papers.length > 0 ? (
        <ul className="papers-list">
          {papers.map((paper) => (
            <PaperCard key={paper.paperId} paper={paper} />
          ))}
        </ul>
      ) : (
        !loading && <div>No papers found</div>
      )}
    </div>
  );
}
