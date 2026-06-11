import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, List, ListItem, Divider, TextField, Button, Box, Alert, Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
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
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
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
          onChange={(e) => setEntryType(e.target.value as 'Hospital'|'OccupationalHealthcare'|'HealthCheck')}
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
        const payload: Record<string, unknown> = {
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
        if (diagnosisCodes && diagnosisCodes.length > 0) {
          payload.diagnosisCodes = diagnosisCodes;
        }

        try {
          const newEntry = await patientService.addEntry(patient.id, payload as unknown);
          setPatient({ ...patient, entries: patient.entries.concat(newEntry) });
          setDate(''); setSpecialist(''); setDescription(''); setDischargeDate(''); setDischargeCriteria(''); setDiagnosisCodes([]); setEmployerName(''); setSickStart(''); setSickEnd(''); setHealthCheckRating('');
        } catch (err: unknown) {
          const extractError = (error: unknown) => {
            if (error instanceof Error) return error.message;
            if (typeof error === 'object' && error !== null) {
              const e = error as { response?: { data?: { error?: string } } };
              return e.response?.data?.error ?? JSON.stringify(error);
            }
            return String(error);
          };
          setFormError(extractError(err));
        }
      }} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}>
        <TextField label="Date" type="date" InputLabelProps={{ shrink: true }} value={date} onChange={(e) => setDate(e.target.value)} />
        <TextField label="Specialist" value={specialist} onChange={(e) => setSpecialist(e.target.value)} />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={3} />
        {entryType === 'Hospital' && (
          <>
            <TextField label="Discharge Date" type="date" InputLabelProps={{ shrink: true }} value={dischargeDate} onChange={(e) => setDischargeDate(e.target.value)} />
            <TextField label="Discharge Criteria" value={dischargeCriteria} onChange={(e) => setDischargeCriteria(e.target.value)} />
          </>
        )}
        {entryType === 'OccupationalHealthcare' && (
          <>
            <TextField label="Employer Name" value={employerName} onChange={(e) => setEmployerName(e.target.value)} />
            <TextField label="Sick Leave Start" type="date" InputLabelProps={{ shrink: true }} value={sickStart} onChange={(e) => setSickStart(e.target.value)} />
            <TextField label="Sick Leave End" type="date" InputLabelProps={{ shrink: true }} value={sickEnd} onChange={(e) => setSickEnd(e.target.value)} />
          </>
        )}
        {entryType === 'HealthCheck' && (
          <FormControl>
            <InputLabel id="health-rating-label">Health rating</InputLabel>
            <Select
              labelId="health-rating-label"
              value={healthCheckRating}
              label="Health rating"
              onChange={(e) => setHealthCheckRating(e.target.value as number)}
            >
              <MenuItem value={0}>0 - Healthy</MenuItem>
              <MenuItem value={1}>1 - Low risk</MenuItem>
              <MenuItem value={2}>2 - High risk</MenuItem>
              <MenuItem value={3}>3 - Critical risk</MenuItem>
            </Select>
          </FormControl>
        )}

        <FormControl>
          <InputLabel id="diagnosis-codes-label">Diagnosis Codes</InputLabel>
          <Select
            labelId="diagnosis-codes-label"
            multiple
            value={diagnosisCodes}
            onChange={(e) => setDiagnosisCodes(e.target.value as string[])}
            input={<OutlinedInput label="Diagnosis Codes" />}
            renderValue={(selected) => (selected as string[]).join(', ')}
          >
            {diagnoses.map((d) => (
              <MenuItem key={d.code} value={d.code}>
                <Checkbox checked={diagnosisCodes.indexOf(d.code) > -1} />
                <ListItemText primary={`${d.code} ${d.name}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained">Add Entry</Button>
      </Box>
    </Container>
  );
};

export default SinglePatientPage;