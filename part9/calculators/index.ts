import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
import express from 'express';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const heightString = req.query.height;
  const weightString = req.query.weight;
  if (!heightString || !weightString || isNaN(Number(heightString)) || isNaN(Number(weightString)))
    return res.status(400).send({ error: 'malformatted parameters' });

  const weight = Number(weightString);
  const height = Number(heightString);
  const bmi = calculateBmi(height, weight);

  return res.send({ weight, height, bmi });
});

app.post('/api/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) return res.status(400).send({ error: 'parameters missing' });

  if (
    isNaN(Number(target)) ||
    !(daily_exercises instanceof Array) ||
    daily_exercises.some(x => isNaN(Number(x)))
  )
    return res.status(400).send({ error: 'malformatted parameters' });

  return res.json(
    calculateExercises(
      daily_exercises.map(x => Number(x)),
      Number(target)
    )
  );
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
