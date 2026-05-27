import { parseNumberArgument } from "./utils.ts";

interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (
  exerciseHours: number[],
  target: number
): ExerciseResult => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.filter((hours) => hours > 0).length;
  const totalHours = exerciseHours.reduce((sum, hours) => sum + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  const targetRatio = average / target;

  if (targetRatio >= 1) {
    rating = 3;
    ratingDescription = "excellent work!";
  } else if (targetRatio >= 0.75) {
    rating = 2;
    ratingDescription = "shows promise";
  } else {
    rating = 1;
    ratingDescription = "there is room for improvement";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const args = process.argv.slice(2);

try {
  const target = parseNumberArgument(args[0], "target");
  const exerciseHours: number[] = [];

  for (let i = 1; i < args.length; i++) {
    exerciseHours.push(parseNumberArgument(args[i], `day ${i}`));
  }

  console.log(calculateExercises(exerciseHours, target));
} catch (error) {
  console.log((error as Error).message);
  process.exit(1);
}
