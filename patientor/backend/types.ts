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


export interface HospitalEntry {
  id: string;
  date: string;
  type: "Hospital";
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
  description: string;
  discharge: {
    date: string;
    criteria: string;
  };
}

export interface OccupationalHealthcareEntry {
  id: string;
  date: string;
  type: "OccupationalHealthcare";
  specialist: string;
  employerName: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
  description: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth?: string;
  ssn?: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export type NewPatient = Omit<Patient, 'id' | 'entries'>;
export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
