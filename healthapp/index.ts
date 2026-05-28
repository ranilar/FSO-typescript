import express from 'express';
import type { Request, Response } from 'express';
import { bmicalculator } from './bmiCalculator.ts';
import { parseNumberArgument, isNotNumber } from './utils.ts';
import { calculateExercises } from './exerciseCalculator.ts';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req: Request, res: Response) => {
  const height = req.query.height;
  const weight = req.query.weight;

  if (Array.isArray(height) || Array.isArray(weight)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  if (typeof height !== 'string' || typeof weight !== 'string') {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  if (isNotNumber(height) || isNotNumber(weight)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  try {
    const heightNum = parseNumberArgument(height, 'height');
    const weightNum = parseNumberArgument(weight, 'weight');
    const bmi = bmicalculator(heightNum, weightNum);

    return res.json({
      weight: weightNum,
      height: heightNum,
      bmi,
    });
  } catch (error) {
    return res.status(400).json({ error: error, message: 'malformatted parameters' });
  }
});

app.post('/exercises', (req: Request, res: Response) => {
  const body: unknown = req.body;

  if (!body || typeof body !== 'object' || !('daily_exercises' in body) || !('target' in body)) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  const b = body;

  if (!Array.isArray(b.daily_exercises) || b.daily_exercises.some(d => isNaN(Number(d))) || isNaN(Number(b.target))) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const hours: number[] = b.daily_exercises.map(d => Number(d));
  const targetNum = Number(b.target);

  const result = calculateExercises(hours, targetNum);
  return res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});