// src/components/PaperCard.jsx
export default function PaperCard({ paper }) {
    return (
      <li className="paper-card">
        <a
          href={`https://www.semanticscholar.org/paper/${paper.paperId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {paper.title}
        </a>
        <p>
          {paper.authors?.length
            ? paper.authors.map((a) => a.name || 'Unknown').join(', ')
            : 'No authors available'}
        </p>
        <p>{paper.year}</p>
      </li>
    );
  }
  