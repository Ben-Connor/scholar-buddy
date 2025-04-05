// src/components/PaperList.jsx
import PaperCard from './PaperCard';

export default function PaperList({ papers }) {
  if (!papers.length) return <p>No papers found.</p>;

  return (
    <ul>
      {papers.map((paper) => (
        <PaperCard key={paper.paperId} paper={paper} />
      ))}
    </ul>
  );
}
