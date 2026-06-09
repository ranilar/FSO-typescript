export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other'
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export interface Entry {
  id: string;
  date: string;
  specialist: string;
  description: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth?: string;
  ssn?: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export type NewPatient = Omit<Patient, 'id'>;
export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
