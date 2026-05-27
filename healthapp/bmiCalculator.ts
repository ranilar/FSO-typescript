import { parseNumberArgument } from "./utils.ts";

const bmicalculator = (h: number, w: number): string => {
  const bmi = w / ((h/100)*(h/100));
  if (bmi < 16) {
    return "Underweight (Severe thinness)";
  }
  if (bmi >= 16 && bmi < 17) {
    return "Underweight (Moderate thinness)";
  }
  if (bmi >= 17 && bmi < 18.5) {
    return "Underweight (Mild thinness)";
  }
  if (bmi >= 18.5 && bmi < 25) {
    return "Normal range";
  }
  if (bmi >= 25 && bmi < 30) {
    return "Overweight (Pre-obese)";
  }
  if (bmi >= 30 && bmi < 35) {
    return "Obese (Class I)";
  }
  if (bmi >= 35 && bmi < 40) {
    return "Obese (Class II)";
  }
  if (bmi >= 40) {
    return "Obese (Class III)";
  }
  return "";
};

const args = process.argv.slice(2);

try {
  const height = parseNumberArgument(args[0], "height");
  const weight = parseNumberArgument(args[1], "weight");
  console.log(bmicalculator(height, weight));
} catch (error) {
  console.log((error as Error).message);
  process.exit(1);
}