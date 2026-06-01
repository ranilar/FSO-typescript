import express from 'express';
import diagnoses from '../data/diagnoses.ts';
import patients from '../data/patients.ts';
import { v1 as uuid } from 'uuid';
import type { Diagnosis, Patient, NonSensitivePatient } from './types.ts';

const app = express();
app.use(express.json());
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.get('/api/diagnoses', (_req, res) => {
  const d = (diagnoses as any)?.default ?? diagnoses;
  const result: Diagnosis[] = d as Diagnosis[];
  res.json(result);
});

app.get('/api/patients', (_req, res) => {
  const p = (patients as any)?.default ?? patients;
  const patientsData: Patient[] = p as Patient[];
  const result: NonSensitivePatient[] = patientsData.map(({ ssn, ...rest }) => rest);
  res.json(result);
});

app.post('/api/patients', (req, res) => {
  const p = (patients as any)?.default ?? patients;
  const patientsData: Patient[] = p as Patient[];
  const body = req.body as Omit<Patient, 'id'>;
  const newPatient: Patient = { id: uuid(), ...body };
  patientsData.push(newPatient);
  res.json(newPatient);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});