export const isNotNumber = (argument: any): boolean => {
  return isNaN(Number(argument)) || argument === "";
};

export const parseNumberArgument = (argument: string, name: string): number => {
  if (isNotNumber(argument)) {
    throw new Error(`Argument ${name} was not a number!`);
  }
  return Number(argument);
};
