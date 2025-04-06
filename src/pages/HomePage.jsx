import { useState } from "react";
import { motion } from "framer-motion";
import React from "react";
import SearchPage from "../components/SearchPage";
import HomeButton from "../components/HomeButton";
import QuestionSearch from "../components/QuestionSearch";

export default function HomePage() {
  const [resetKey, setResetKey] = useState(0); // State to trigger reset

  const handleReset = () => {
    setResetKey((prevKey) => prevKey + 1); // Increment the key to reset the page
  };

  return (
    <>
      <HomeButton onClick={handleReset} /> {/* Pass the reset handler */}
      <motion.div
        key={resetKey} // Use the resetKey to force re-render
        className="home-page"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ duration: 1.0 }}
      >
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
      </motion.div>
    </>
  );
}