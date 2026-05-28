export const isNotNumber = (argument: unknown): boolean => {
  return isNaN(Number(argument)) || String(argument) === "";
};

export const parseNumberArgument = (argument: string, name: string): number => {
  if (isNotNumber(argument)) {
    throw new Error(`Argument ${name} was not a number!`);
  }
  return Number(argument);
};
