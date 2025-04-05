const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors'); // To enable cross-origin requests

const app = express();
const port = 5000;

app.use(cors()); // Allow frontend to communicate with backend

app.get('/search', async (req, res) => {
    const query = req.query.query || '';  // Get the search term
  
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required.' });
    }
  
    try {
      // Launch Puppeteer and navigate to Google Scholar
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
  
      await page.goto('https://scholar.google.com');
  
      // Type the search term into the search input
      await page.type('input[name="q"]', query);
  
      // Wait for the search button to appear and click it
      await page.waitForSelector('#gs_hdr_tsb', { visible: true });
      await page.click('#gs_hdr_tsb');
  
      // Wait for the results to load (wait for search result items to appear)
      await page.waitForSelector('.gs_r.gs_or.gs_scl');
  
      // Extract paper titles, links, and PDF links
      const results = await page.evaluate(() => {
        const papers = [];
        const items = document.querySelectorAll('.gs_r.gs_or.gs_scl'); // Select each result item
  
        items.forEach(item => {
          const titleElement = item.querySelector('.gs_rt a');
          const title = titleElement ? titleElement.textContent : '';
          const link = titleElement ? titleElement.href : ''; // Extract the paper link
  
          // Find the div containing the PDF link with class gs_or_ggsm at the same level
          const pdfDivElement = item.querySelector('.gs_or_ggsm');
  
          // Extract the PDF link if available
          let pdfLink = '';
          if (pdfDivElement) {
            const pdfAnchor = pdfDivElement.querySelector('a');
            if (pdfAnchor) {
              pdfLink = pdfAnchor.href;  // Get the href attribute of the <a> tag
            }
          }
  
          // Add the paper data to the result array
          papers.push({ title, link, pdfLink });
        });
  
        return papers;  // Return the array of papers
      });
  
      console.log('Scraped papers:', results);  // Log the results for debugging
  
      await browser.close();
  
      res.json(results);  // Send the scraped results to the frontend
    } catch (error) {
      console.error('Error fetching papers:', error);  // Log the error
      res.status(500).json({ error: `An error occurred while fetching papers: ${error.message}` });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
<<<<<<< HEAD
});
=======
});
>>>>>>> 6acdccd1ea16c3ae7b5ed1416fee702420fabcd0
