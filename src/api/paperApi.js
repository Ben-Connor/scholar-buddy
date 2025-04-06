import axios from 'axios';

const API_BASE_URL = 'http://export.arxiv.org/api/query';

// Field mappings for consistency with previous implementation
const mapArxivResponse = (entry) => {
  // Extract PDF link (if available)
  const pdfLink = Array.from(entry.getElementsByTagName('link')).find(link => 
    link.getAttribute('type') === 'application/pdf'
  )?.getAttribute('href'); // Extract PDF URL

  return {
    title: entry.getElementsByTagName('title')[0]?.textContent,
    abstract: entry.getElementsByTagName('summary')[0]?.textContent,
    paperId: entry.getElementsByTagName('id')[0]?.textContent.split('/').pop().split('v')[0],
    year: new Date(entry.getElementsByTagName('published')[0]?.textContent).getFullYear(),
    authors: Array.from(entry.getElementsByTagName('author')).map(
      author => ({ name: author.getElementsByTagName('name')[0]?.textContent })
    ),
    url: entry.getElementsByTagName('id')[0]?.textContent,
    pdfUrl: pdfLink, // Add the PDF link to the result
    venue: "arXiv",
    fieldsOfStudy: Array.from(entry.getElementsByTagName('category')).map(
      category => category.getAttribute('term')
    ) || []
  };
};

/**
 * Search for papers based on query
 */
export async function searchPapers(query, limit = 10) {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        search_query: `all:${query}`,
        start: 0,
        max_results: limit,
        sortBy: 'relevance',
        sortOrder: 'descending'
      },
      headers: {
        'Accept': 'application/json'
      },
      transformResponse: [(data) => {
        // Parse XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        
        const entries = Array.from(xmlDoc.getElementsByTagName('entry'));
        
        return {
          data: entries.map(entry => mapArxivResponse(entry)) // Use the mapping function
        };
      }]
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
    const response = await axios.get(API_BASE_URL, {
      params: {
        id_list: paperId,
        max_results: 1
      },
      headers: {
        'Accept': 'application/json'
      },
      transformResponse: [(data) => {
        // Parse XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        
        const entry = xmlDoc.getElementsByTagName('entry')[0];
        if (!entry) {
          return null;
        }
        
        // Extract data using the map function
        return mapArxivResponse(entry);
      }]
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching paper details:', error);
    throw new Error('Failed to fetch paper details');
  }
}

/**
 * Get papers by category
 */
export async function getPapersByCategory(category, limit = 10) {
  try {
    const response = await axios.get(API_BASE_URL, {
      params: {
        search_query: `cat:${category}`,
        start: 0,
        max_results: limit,
        sortBy: 'submittedDate',
        sortOrder: 'descending'
      },
      headers: {
        'Accept': 'application/json'
      },
      transformResponse: [(data) => {
        // Parse XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        
        const entries = Array.from(xmlDoc.getElementsByTagName('entry'));
        
        return {
          data: entries.map(entry => mapArxivResponse(entry)) // Use the mapping function
        };
      }]
    });
    
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching papers by category:', error);
    throw new Error('Failed to fetch papers by category');
  }
}
