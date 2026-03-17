const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/mrsoomro', async (req, res) => {
    const number = req.query.number;
    if (!number) {
        return res.json({ error: "Please provide a number. Example: ?number=03001234567" });
    }

    try {
        // Hum target website ko request bhej rahe hain
        const targetUrl = `https://javeriasimdatabase.com/search.php?num=${number}`;
        
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // HTML ko parse (read) karna
        const $ = cheerio.load(response.data);
        
        // Yahan hum table ya div se data nikalte hain (Is part ko target site ke mutabiq adjust karna hota hai)
        let results = [];
        $('table tr').each((i, el) => {
            const row = $(el).text().trim();
            if(row) results.push(row);
        });

        res.json({
            status: "success",
            developer: "MR SOOMRO",
            number: number,
            data: results.length > 0 ? results : "No record found or website changed layout"
        });

    } catch (error) {
        res.status(500).json({ error: "Server error or Target site down", details: error.message });
    }
});
 
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
