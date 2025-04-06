import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion
import { getPaperDetails } from "../api/paperApi";
import axios from "axios";
import HighlightableText from '../components/HighlightableText';
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css"; // Import KaTeX styles

export default function PaperPage() {
  const { paperId } = useParams();
  const location = useLocation();
  const [paper, setPaper] = useState(null);
  const [parsedText, setParsedText] = useState("");
  const [loading, setLoading] = useState({
    paper: true,
    parsedText: false,
  });
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "regular";

  useEffect(() => {
    async function loadPaperDetailsAndParseText() {
      try {
        const data = await getPaperDetails(paperId);
        setPaper(data);
        setLoading((prev) => ({ ...prev, paper: false }));

        if (data.pdfUrl) {
          setLoading((prev) => ({ ...prev, parsedText: true }));
          const extractResponse = await axios.post("http://localhost:3000/extract-text", {
            url: data.pdfUrl,
          });

          const extractedText = extractResponse.data.text;

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

  const handleReadOnArxiv = () => {
    if (paper.url) {
      window.open(paper.url, "_blank");
    }
  };

  const handleDownloadPDF = () => {
    if (paper.pdfUrl) {
      window.open(paper.pdfUrl, "_blank");
    }
  };

  return (
    <motion.div
      className="paper-details"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="paper-title">{paper.title}</h1>
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
          <ReactMarkdown
            children={parsedText || "No parsed text available."}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          />
        )}
      </div>

      <div className="paper-actions">
        <button
          onClick={handleReadOnArxiv}
          className="action-button"
          disabled={!paper.url}
        >
          Read on arXiv
        </button>
        <button
          onClick={handleDownloadPDF}
          className="action-button pdf-button"
          disabled={!paper.pdfUrl}
        >
          Download PDF
        </button>
      </div>
    </motion.div>
  );
}