// src/components/PaperPage.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // Import useLocation
import { getPaperDetails } from "../api/paperApi";
import axios from "axios";
import ReactMarkdown from "react-markdown"; // Import react-markdown
import handleClickText from "../utils/highlight"; // Import the highlight hook
import HighlightableText from '../components/HighlightableText';

export default function PaperPage() {
  const { paperId } = useParams();
  const location = useLocation(); // Get the current location
  const [paper, setPaper] = useState(null);
  const [parsedText, setParsedText] = useState("");
  const [loading, setLoading] = useState({
    paper: true,
    parsedText: false,
  });
  const [error, setError] = useState(null);

  // Extract the mode from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "regular";

  // Apply the highlight hook
  handleClickText();

  // Fetch paper details and parse text on page load
  useEffect(() => {
    async function loadPaperDetailsAndParseText() {
      try {
        // Fetch paper details
        const data = await getPaperDetails(paperId);
        setPaper(data);
        setLoading((prev) => ({ ...prev, paper: false }));

        // Parse text using AI if PDF URL is available
        if (data.pdfUrl) {
          setLoading((prev) => ({ ...prev, parsedText: true }));
          const extractResponse = await axios.post("http://localhost:3000/extract-text", {
            url: data.pdfUrl,
          });

          const extractedText = extractResponse.data.text;

          // Send extracted text to AI for parsing
          const parseResponse = await axios.post("http://localhost:3000/parse-paper", {
            text: extractedText,
            mode: mode,
          });

          setParsedText(parseResponse.data.summary);
        } else {
          setError("No PDF available for this paper.");
        }
      } catch (err) {
        console.error("Error loading paper details or parsing text:", err);
        setError("Failed to load paper details or parse text.");
      } finally {
        setLoading((prev) => ({ ...prev, parsedText: false }));
      }
    }

    loadPaperDetailsAndParseText();
  }, [paperId, mode]);

  if (loading.paper) return <div>Loading paper details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!paper) return <div>Paper not found</div>;

  return (
    <div className="paper-details">
      <h1>{paper.title}</h1>
      <p>
        <strong>Mode:</strong> {mode}
      </p>

      <div className="paper-metadata">
        <p>
          <strong>Authors:</strong>{" "}
          {paper.authors?.length
            ? paper.authors.map((a, index) => (
                <span key={index}>
                  {a.name || "Unknown"}
                  {index < paper.authors.length - 1 ? ", " : ""}
                </span>
              ))
            : "No authors available"}
        </p>

        <p>
          <strong>Year:</strong> {paper.year}
        </p>
        {paper.venue && (
          <p>
            <strong>Venue:</strong> {paper.venue}
          </p>
        )}

        {paper.fieldsOfStudy?.length > 0 && (
          <p>
            <strong>Fields of Study:</strong>{" "}
            {paper.fieldsOfStudy.join(", ")}
          </p>
        )}
      </div>

      <div className="paper-content">
        <h2>Abstract</h2>
        <p>{paper.abstract || "No abstract available"}</p>

        <h2>AI Parsed Text</h2>
        {loading.parsedText ? (
          <div className="loading-text">Parsing text with AI...</div>
        ) : (
          <HighlightableText text={parsedText || "No parsed text available."} />
        )}
      </div>

      <div className="paper-actions">
        {paper.url && (
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="action-button"
          >
            Read on arXiv
          </a>
        )}

        {paper.pdfUrl && (
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="action-button pdf-button"
          >
            Download PDF
          </a>
        )}
      </div>
    </div>
  );
}
