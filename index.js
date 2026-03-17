const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();

app.get('/api', async (req, res) => {
    const number = req.query.query;
    
    if (!number) {
        return res.json({ 
            success: false, 
            developer: "MR SOOMRO",
            message: "Please provide a number. Example: ?query=03072570480" 
        });
    }

    try {
        // Target Website Link
        const targetUrl = `https://javeriasimdatabase.com/search.php?num=${number}`;
        
        const response = await axios.get(targetUrl, { 
            timeout: 8000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        let resultData = [];

        // Data nikalne ka tareeqa (Table rows se)
        $('table tr').each((i, el) => {
            let text = $(el).text().replace(/\s+/g, ' ').trim();
            if (text) resultData.push(text);
        });

        res.json({
            success: true,
            developer: "MR SOOMRO",
            result: resultData.length > 0 ? resultData : "No Record Found"
        });

    } catch (error) {
        res.json({ 
            success: false, 
            developer: "MR SOOMRO",
            message: "Target site blocked the request or is down.",
            error: error.message 
        });
    }
});

module.exports = app;
