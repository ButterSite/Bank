import express from 'express';

const app = express();
const PORT = 3000;

app.get('/test', (req, res) => {
  console.log('GET /test hit');
  res.status(200).json({ message: 'Server works!' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});