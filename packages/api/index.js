const express = require('express');

const app = express();

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from API' });
});

app.listen(3001, () => {
  console.log('API listening on port 3001');
});
