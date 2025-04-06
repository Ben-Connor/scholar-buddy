import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import HomePage from './pages/HomePage';
import PaperPage from './pages/PaperPage';
import HomeButton from './components/HomeButton'; // Import the Home Button

function App() {
  return (
    <Router>
      <div className="app">
      <HomeButton /> {/* Home Button in the header */}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/paper/:paperId" element={<PaperPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
