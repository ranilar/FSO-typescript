import express from 'express';
import diagnoses from '../data/diagnoses.ts';
import patients from '../data/patients.ts';
import { v1 as uuid } from 'uuid';
import type { Diagnosis, Patient, NonSensitivePatient, NewPatient } from './types.ts';
import { toNewPatient } from './utils.ts';

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

function getModuleExport<T>(mod: unknown): T {
  if (mod && typeof mod === 'object' && 'default' in mod) {
    const rec = mod as Record<string, unknown>;
    return rec['default'] as T;
  }
  return mod as T;
}

app.get('/api/diagnoses', (_req, res) => {
  const result = getModuleExport<Diagnosis[]>(diagnoses);
  res.json(result);
});

app.get('/api/patients/:id', (req, res) => {
  const patientsData = getModuleExport<Patient[]>(patients);
  const patient = patientsData.find(p => p.id === req.params.id);
  if (patient) {
    console.log("patient found")
    res.json(patient);
  } else {
    res.sendStatus(404);
  }
});

app.get('/api/patients', (_req, res) => {
  const patientsData = getModuleExport<Patient[]>(patients);
  const result: NonSensitivePatient[] = patientsData.map(({ ssn: _ssn, ...rest }) => rest);
  res.json(result);
});

app.post('/api/patients', (req, res) => {
  try {
    const patientsData = getModuleExport<Patient[]>(patients);
    const newPatientData: NewPatient = toNewPatient(req.body);
    const newPatient: Patient = { id: uuid(), ...newPatientData };
    patientsData.push(newPatient);
    res.json(newPatient);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    res.status(400).send({ error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});