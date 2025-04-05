export async function getPaperDetails(paperId) {
    const response = await fetch(
      `https://api.semanticscholar.org/graph/v1/paper/${paperId}?fields=title,abstract,tldr,url,authors,year,venue,fieldsOfStudy`
    );
  
    if (!response.ok) {
      throw new Error('Failed to fetch paper details');
    }
  
    return response.json();
  }
  