const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid URL parameter' });
  }

  try {
    const promises = urls.map(url => axios.get(url));
    const responses = await Promise.allSettled(promises);

    let mergedNumbers = [];
    
    responses.forEach(response => {
      if (response.status === 'fulfilled') {
        const data = response.value.data;
        
        if (data && Array.isArray(data.numbers)) {
          mergedNumbers.push(...data.numbers);
        }
      }
    });

    // Remove duplicates and sort in ascending order
    mergedNumbers = [...new Set(mergedNumbers)].sort((a, b) => a - b);

    return res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error(error);
    
  	return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const port = process.env.PORT || 8008;
app.listen(port, () => console.log(`Server listening on port ${port}`));