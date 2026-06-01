import { z } from 'zod';
import type { NewPatient } from './types.ts';

const newPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().optional().refine((s) => !s || Boolean(Date.parse(s)), {
    message: 'Invalid date'
  }),
  ssn: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']),
  occupation: z.string()
});

export const toNewPatient = (object: unknown): NewPatient => {
  return newPatientSchema.parse(object);
};

export const isNewPatient = (obj: unknown): obj is NewPatient => {
  try {
    newPatientSchema.parse(obj);
    return true;
  } catch {
    return false;
  }
};
