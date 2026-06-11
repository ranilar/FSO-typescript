import express from 'express';
import diagnoses from '../data/diagnoses.ts';
import patients from '../data/patients.ts';
import { v1 as uuid } from 'uuid';
import type { Diagnosis, Patient, NonSensitivePatient, NewPatient, Entry } from './types.ts';
import { toNewPatient, toNewEntry } from './utils.ts';
import { ZodError } from "zod"

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
    console.log("patient found");
    const patientWithEntries = { ...patient, entries: patient.entries ?? [] };
    res.json(patientWithEntries);
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
    const newPatient: Patient = { id: uuid(), ...newPatientData, entries: [] };
    patientsData.push(newPatient);
    res.json(newPatient);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    res.status(400).send({ error: errorMessage });
  }
});

app.post('/api/patients/:id/entries', (req, res) => {
  try {
    const patientsData = getModuleExport<Patient[]>(patients);
    const patient = patientsData.find(p => p.id === req.params.id);
    if (!patient) { res.sendStatus(404); return; }

    const newEntryData = toNewEntry(req.body);
    const newEntry: Entry = { id: uuid(), ...newEntryData };

    patient.entries = patient.entries ?? [];
    patient.entries.push(newEntry);

    res.json(newEntry);
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      const msg = e.issues
        .map(i => {
          const path = i.path && i.path.length ? i.path.join('.') : 'data';
          return `${path}: ${i.message}`;
        })
        .join(', ');
      res.status(400).send({ error: msg });
      return;
    }
    
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    res.status(400).send({ error: errorMessage });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});