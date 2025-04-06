import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PaperPage from "./pages/PaperPage";
import QuestionResults from "./components/QuestionResultsPage"; // Match your filename exactly

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/paper/:id" element={<PaperPage />} />
        <Route path="/question-results" element={<QuestionResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
