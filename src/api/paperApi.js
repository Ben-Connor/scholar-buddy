// src/api/paperApi.js
import axios from 'axios';

const API_BASE_URL = 'https://api.semanticscholar.org/graph/v1';

// Reusable field sets
const SUMMARY_FIELDS = 'title,authors,year,paperId,abstract';
const DETAIL_FIELDS = 'title,abstract,tldr,url,authors,year,venue,fieldsOfStudy,citations';

/**
 * Search for papers based on query
 */
export async function searchPapers(query, limit = 10) {
  try {
    const response = await axios.get(`${API_BASE_URL}/paper/search`, {
      params: {
        query: query,
        limit: limit,
        fields: SUMMARY_FIELDS
      }
    });
    
    return response.data?.data || [];
  } catch (error) {
    console.error('Error searching papers:', error);
    throw new Error('Failed to search papers');
  }
}

/**
 * Get detailed information about a specific paper
 */
export async function getPaperDetails(paperId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/paper/${paperId}`, {
      params: {
        fields: DETAIL_FIELDS
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching paper details:', error);
    throw new Error('Failed to fetch paper details');
  }
}
