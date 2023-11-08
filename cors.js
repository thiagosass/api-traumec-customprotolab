const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'traumaec-customprotolab.vercel.app',
}));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});