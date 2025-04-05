// src/pages/HomePage.jsx
import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import PaperList from '../components/PaperList';
import { fetchPapers } from '../api/papers';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const results = await fetchPapers(searchTerm);
      setPapers(results);
    } catch (err) {
      setError(`Something went wrong: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <h1>Scholar Buddy</h1>
      <p>Welcome to Scholar Buddy</p>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSubmit={handleSearch}
      />
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <PaperList papers={papers} />
    </div>
  );
}
