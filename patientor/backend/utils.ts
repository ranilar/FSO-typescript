import type { NewPatient } from './types.ts';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): boolean => {
  return ['male', 'female', 'other'].includes(param);
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const parseDateOfBirth = (date: unknown): string | undefined => {
  if (!date) return undefined;
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect dateOfBirth');
  }
  return date;
};

const parseSsn = (ssn: unknown): string | undefined => {
  if (!ssn) return undefined;
  if (!isString(ssn)) {
    throw new Error('Incorrect ssn');
  }
  return ssn;
};

const parseOccupation = (occ: unknown): string => {
  if (!occ || !isString(occ)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occ;
};

const parseGender = (gender: unknown): string => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or missing gender');
  }
  return gender;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj: any = object as any;

  const newPatient: NewPatient = {
    name: parseName(obj.name),
    dateOfBirth: parseDateOfBirth(obj.dateOfBirth),
    ssn: parseSsn(obj.ssn),
    gender: parseGender(obj.gender) as any,
    occupation: parseOccupation(obj.occupation)
  };

  return newPatient;
};

export const isNewPatient = (obj: unknown): obj is NewPatient => {
  try {
    toNewPatient(obj);
    return true;
  } catch {
    return false;
  }
};
