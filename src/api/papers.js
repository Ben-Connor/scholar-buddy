// src/api/papers.js
import axios from 'axios';

export async function fetchPapers(query) {
  const response = await axios.get(`https://api.semanticscholar.org/graph/v1/paper/search`, {
    params: {
      query,
      limit: 5,
      fields: 'title,authors,year,paperId'
    }
  });
  return response.data?.data ?? [];
}
