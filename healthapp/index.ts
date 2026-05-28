import express from 'express';
import type { Request, Response } from 'express';
import { bmicalculator } from './bmiCalculator.ts';
import { parseNumberArgument, isNotNumber } from './utils.ts';
import { calculateExercises } from './exerciseCalculator.ts';

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello full stack!');
});

app.get('/bmi', (req: Request, res: Response) => {
  const height = req.query.height;
  const weight = req.query.weight;

  if (Array.isArray(height) || Array.isArray(weight)) {
    return res.status(400).json({ error: 'invalid parameters' });
  }

  if (typeof height !== 'string' || typeof weight !== 'string') {
    return res.status(400).json({ error: 'invalid parameters' });
  }

  if (isNotNumber(height) || isNotNumber(weight)) {
    return res.status(400).json({ error: 'invalid parameters' });
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = req.body;

  if (!body || body.daily_exercises === undefined || body.target === undefined) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  const { daily_exercises, target } = body;

  if (!Array.isArray(daily_exercises) || daily_exercises.some((d: any) => isNaN(Number(d))) || isNaN(Number(target))) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const hours: number[] = daily_exercises.map((d: any) => Number(d));
  const targetNum = Number(target);

  const result = calculateExercises(hours, targetNum);
  return res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});