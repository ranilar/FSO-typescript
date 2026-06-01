export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

export type Gender = string;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth?: string;
  ssn?: string;
  gender: Gender;
  occupation: string;
}

export type NonSensitivePatient = Omit<Patient, 'ssn'>;
