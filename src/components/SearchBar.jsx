// src/components/SearchBar.jsx
export default function SearchBar({ searchTerm, setSearchTerm, onSubmit }) {
    return (
      <form onSubmit={onSubmit}>
        <label htmlFor="search">Search for Topic:</label>
        <input
          type="text"
          id="search"
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </form>
    );
  }
  