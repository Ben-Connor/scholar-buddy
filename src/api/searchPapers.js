export async function searchPapers(query) {
  const response = await fetch(
    `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=10&fields=title,abstract,tldr,url,authors,year,paperId`
  );

  if (!response.ok) {
    throw new Error('Semantic Scholar API error');
  }

  const result = await response.json();
  return result.data;  // array of paper objects
}
