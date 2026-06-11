import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, List, ListItem, Divider, TextField, Button, Box, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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
  const [entryType, setEntryType] = useState<'Hospital'|'OccupationalHealthcare'|'HealthCheck'>('HealthCheck');
  const [employerName, setEmployerName] = useState('');
  const [sickStart, setSickStart] = useState('');
  const [sickEnd, setSickEnd] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<number | ''>('');

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
      <Typography variant="h6">New Entry</Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="entry-type-label">Entry type</InputLabel>
        <Select
          labelId="entry-type-label"
          value={entryType}
          label="Entry type"
          onChange={(e) => setEntryType(e.target.value as any)}
        >
          <MenuItem value="HealthCheck">Health Check</MenuItem>
          <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
        </Select>
      </FormControl>
      {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
      <Box component="form" onSubmit={async (e) => {
        e.preventDefault();
        setFormError(null);
        if (!patient) return;
        let payload: any = {
          type: entryType,
          date,
          specialist,
          description
        };
        if (entryType === 'Hospital') {
          payload.discharge = { date: dischargeDate, criteria: dischargeCriteria };
        }
        if (entryType === 'OccupationalHealthcare') {
          payload.employerName = employerName;
          if (sickStart || sickEnd) payload.sickLeave = { startDate: sickStart, endDate: sickEnd };
        }
        if (entryType === 'HealthCheck') {
          payload.healthCheckRating = healthCheckRating === '' ? undefined : Number(healthCheckRating);
        }
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
        {entryType === 'Hospital' && (
          <>
            <TextField label="Discharge Date" value={dischargeDate} onChange={(e) => setDischargeDate(e.target.value)} />
            <TextField label="Discharge Criteria" value={dischargeCriteria} onChange={(e) => setDischargeCriteria(e.target.value)} />
          </>
        )}
        {entryType === 'OccupationalHealthcare' && (
          <>
            <TextField label="Employer Name" value={employerName} onChange={(e) => setEmployerName(e.target.value)} />
            <TextField label="Sick Leave Start" value={sickStart} onChange={(e) => setSickStart(e.target.value)} />
            <TextField label="Sick Leave End" value={sickEnd} onChange={(e) => setSickEnd(e.target.value)} />
          </>
        )}
        {entryType === 'HealthCheck' && (
          <TextField label="Health Check Rating (0-3)" value={String(healthCheckRating)} onChange={(e) => setHealthCheckRating(e.target.value === '' ? '' : Number(e.target.value))} />
        )}
        <TextField label="Diagnosis Codes" value={diagnosisCodes} onChange={(e) => setDiagnosisCodes(e.target.value)} />
        <Button type="submit" variant="contained">Add Entry</Button>
      </Box>
    </Container>
  );
};

export default SinglePatientPage;