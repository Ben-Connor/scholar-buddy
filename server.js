const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to handle file uploads
app.use(fileUpload());

app.post('/extract-text', async (req, res) => {
    if (req.body.url) {
        // Handle URL-based PDF fetching
        try {
            const pdfResponse = await axios.get(req.body.url, { responseType: 'arraybuffer' });
            const pdfData = await pdfParse(pdfResponse.data);
            return res.send({ text: pdfData.text });
        } catch (error) {
            return res.status(500).send('Error fetching or processing PDF from URL.');
        }
    } else if (req.files && req.files.pdfFile) {
        // Handle file upload
        const pdfFile = req.files.pdfFile;
        try {
            const pdfData = await pdfParse(pdfFile.data);
            return res.send({ text: pdfData.text });
        } catch (error) {
            return res.status(500).send('Error processing PDF file.');
        }
    } else {
        return res.status(400).send('No PDF file uploaded or URL provided.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});