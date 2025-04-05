import { Link } from "react-router-dom";

export default function PaperCard({ paper }) {
  return (
    <li className="paper-card">
      <Link to={`/paper/${paper.paperId}`}>
        <h3>{paper.title}</h3>
      </Link>
      <p>
        {paper.authors?.length
          ? paper.authors.map((a, index) => (
              <span key={index}>{a.name || 'Unknown'}{index < paper.authors.length - 1 ? ', ' : ''}</span>
            ))
          : 'No authors available'}
      </p>
      <p>{paper.year}</p>
    </li>
  );
}
