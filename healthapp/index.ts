import express from 'express';
import type { Request, Response } from 'express';
import { bmicalculator } from './bmiCalculator.ts';
import { parseNumberArgument, isNotNumber } from './utils.ts';

const app = express();

app.get('/', (_req, res) => {
  res.send('Hello full stack!');
});

app.get('/bmi', (req: Request, res: Response) => {
  const height = req.query.height;
  const weight = req.query.weight;

  if (isNotNumber(height) || isNotNumber(weight)) {
    return res.status(400).json({ error: 'invalid parameters' });
  }

  try {
    const heightNum = parseNumberArgument(String(height), 'height');
    const weightNum = parseNumberArgument(String(weight), 'weight');
    const bmi = bmicalculator(heightNum, weightNum);

    return res.json({
      weight: weightNum,
      height: heightNum,
      bmi,
    });
  } catch (error) {
    return res.status(400).json({ error: 'invalid parameters' });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});