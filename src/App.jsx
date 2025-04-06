import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import HomePage from './pages/HomePage';
import PaperPage from './pages/PaperPage';
import HomeButton from './components/HomeButton'; // Import the Home Button
import React from "react";
import QuestionResults from "./components/QuestionResultsPage"; // Match your filename exactly

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <HomeButton /> {/* Home Button in the header */}
        <Route path="/" element={<HomePage />} />
        <Route path="/paper/:id" element={<PaperPage />} />
        <Route path="/question-results" element={<QuestionResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

