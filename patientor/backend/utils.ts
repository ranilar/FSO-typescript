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

const baseEntry = z.object({
  date: z.string().refine((s) => Boolean(Date.parse(s)), { message: 'Invalid date' }),
  specialist: z.string(),
  description: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

const hospitalEntrySchema = baseEntry.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.string().refine((s) => Boolean(Date.parse(s)), { message: 'Invalid date' }),
    criteria: z.string()
  })
});

const occupationalEntrySchema = baseEntry.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: z.object({
    startDate: z.string().refine((s) => Boolean(Date.parse(s)), { message: 'Invalid date' }),
    endDate: z.string().refine((s) => Boolean(Date.parse(s)), { message: 'Invalid date' })
  }).optional()
});

const healthCheckEntrySchema = baseEntry.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.union([
    z.literal(0), z.literal(1), z.literal(2), z.literal(3)
  ])
});

const entrySchema = z.union([hospitalEntrySchema, occupationalEntrySchema, healthCheckEntrySchema]);

export const toNewEntry = (object: unknown) => {
  return entrySchema.parse(object);
};

export const isNewEntry = (obj: unknown) => {
  try {
    entrySchema.parse(obj);
    return true;
  } catch {
    return false;
  }
};
