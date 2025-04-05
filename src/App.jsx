import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import HomePage from './pages/HomePage';
import PaperPage from './pages/PaperPage';
import PaperAnalysis from './components/PaperAnalysis'; // Import the PaperAnalysis component

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/paper/:paperId" element={<PaperPage />} />
          <Route path="/analyze/:paperId" element={<PaperAnalysis />} /> {/* Add this route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;