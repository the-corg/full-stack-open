import { calculateBmi } from './bmiCalculator';
import express from 'express';
const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = req.query.height;
  const weight = req.query.weight;
  if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight)))
    res.send({ error: 'malformatted parameters' });

  res.send({
    weight,
    height,
    bmi: calculateBmi(Number(height), Number(weight)),
  });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
