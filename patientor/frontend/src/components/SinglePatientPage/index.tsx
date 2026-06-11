import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, List, ListItem, Divider, TextField, Button, Box, Alert } from '@mui/material';
import patientService from '../../services/patients';
import { Patient, Diagnosis } from '../../types';
import EntryDetails from '../EntryDetails';

const SinglePatientPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [description, setDescription] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const data = await patientService.getById(id);
        setPatient(data);
      } catch (e) {
        setError((e as Error).message);
      }
    };
    void fetch();
  }, [id]);

  if (error) return <div>Error: {error}</div>;
  if (!patient) return <div>Loading...</div>;

  return (
    <Container>
      <Typography variant="h4">{patient.name}</Typography>
      <Typography>SSN: {patient.ssn ?? '—'}</Typography>
      <Typography>Occupation: {patient.occupation}</Typography>
      <Typography>Date of birth: {patient.dateOfBirth ?? '—'}</Typography>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Entries</Typography>
      <List>
        {patient.entries.length === 0 ? (
          <ListItem>No entries</ListItem>
        ) : (
          patient.entries.map((entry) => (
            <ListItem key={entry.id}>
              <EntryDetails entry={entry} diagnoses={diagnoses} />
            </ListItem>
          ))
        )}
      </List>

      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Add Hospital Entry</Typography>
      {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
      <Box component="form" onSubmit={async (e) => {
        e.preventDefault();
        setFormError(null);
        if (!patient) return;
        const payload: any = {
          type: 'Hospital',
          date,
          specialist,
          description,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          }
        };
        if (diagnosisCodes.trim()) {
          payload.diagnosisCodes = diagnosisCodes.split(',').map((s: string) => s.trim()).filter(Boolean);
        }

        try {
          const newEntry = await patientService.addEntry(patient.id, payload);
          setPatient({ ...patient, entries: patient.entries.concat(newEntry) });
          setDate(''); setSpecialist(''); setDescription(''); setDischargeDate(''); setDischargeCriteria(''); setDiagnosisCodes('');
        } catch (err: unknown) {
          const msg = (err as any)?.response?.data?.error || (err as Error).message || 'Unknown error';
          setFormError(String(msg));
        }
      }} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}>
        <TextField label="Date" value={date} onChange={(e) => setDate(e.target.value)} />
        <TextField label="Specialist" value={specialist} onChange={(e) => setSpecialist(e.target.value)} />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={3} />
        <TextField label="Discharge Date" value={dischargeDate} onChange={(e) => setDischargeDate(e.target.value)} />
        <TextField label="Discharge Criteria" value={dischargeCriteria} onChange={(e) => setDischargeCriteria(e.target.value)} />
        <TextField label="Diagnosis Codes" value={diagnosisCodes} onChange={(e) => setDiagnosisCodes(e.target.value)} />
        <Button type="submit" variant="contained">Add Entry</Button>
      </Box>
    </Container>
  );
};

export default SinglePatientPage;