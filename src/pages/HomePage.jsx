import React from "react";
import SearchPage from "../components/SearchPage";
import QuestionSearch from "../components/QuestionSearch";

export default function HomePage() {
  return (
    <div className="home-page">
      <h1>Scholar Buddy</h1>
      <p>Search academic papers and get AI-powered summaries</p>
      
      <div className="feature-tabs">
        <div className="tab-content">
          {/* Your existing search feature */}
          <SearchPage />
          
          {/* Add the new question feature */}
          <div className="question-feature">
            <h2>Ask a Research Question</h2>
            <QuestionSearch />
          </div>
        </div>
      </div>
    </div>
  );
}
