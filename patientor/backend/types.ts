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

export const HealthCheckRating = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3,
} as const;

export type HealthCheckRating = typeof HealthCheckRating[keyof typeof HealthCheckRating];

export interface HealthCheckEntry {
  id: string;
  date: string;
  type: "HealthCheck";
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
  description: string;
  healthCheckRating: HealthCheckRating;
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;

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
