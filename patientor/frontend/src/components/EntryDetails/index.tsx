import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Entry, Diagnosis } from '../../types';

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const HospitalEntryView = ({ entry, diagnoses }: { entry: Extract<Entry, { type: 'Hospital' }>; diagnoses?: Diagnosis[] }) => (
  <Card variant="outlined" sx={{ marginBottom: 2 }}>
    <CardContent>
      <Typography variant="subtitle1">{entry.date} 🏥</Typography>
      <Typography>{entry.description}</Typography>
      <Typography variant="body2">specialist: {entry.specialist}</Typography>
      <Typography variant="body2">discharge: {entry.discharge.date} — {entry.discharge.criteria}</Typography>
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <Box component="ul" sx={{ marginTop: 1 }}>
          {entry.diagnosisCodes.map(code => {
            const diag = diagnoses?.find(d => d.code === code);
            return <li key={code}>{code}{diag ? ` ${diag.name}` : ''}</li>;
          })}
        </Box>
      )}
    </CardContent>
  </Card>
);

const OccupationalEntryView = ({ entry, diagnoses }: { entry: Extract<Entry, { type: 'OccupationalHealthcare' }>; diagnoses?: Diagnosis[] }) => (
  <Card variant="outlined" sx={{ marginBottom: 2 }}>
    <CardContent>
      <Typography variant="subtitle1">{entry.date} 🧰</Typography>
      <Typography>{entry.description}</Typography>
      <Typography variant="body2">employer: {entry.employerName}</Typography>
      <Typography variant="body2">specialist: {entry.specialist}</Typography>
      {entry.sickLeave && (
        <Typography variant="body2">sick leave: {entry.sickLeave.startDate} — {entry.sickLeave.endDate}</Typography>
      )}
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <Box component="ul" sx={{ marginTop: 1 }}>
          {entry.diagnosisCodes.map(code => {
            const diag = diagnoses?.find(d => d.code === code);
            return <li key={code}>{code}{diag ? ` ${diag.name}` : ''}</li>;
          })}
        </Box>
      )}
    </CardContent>
  </Card>
);

const EntryDetails = ({ entry, diagnoses }: { entry: Entry; diagnoses?: Diagnosis[] }) => {
  switch (entry.type) {
    case 'Hospital':
      return <HospitalEntryView entry={entry} diagnoses={diagnoses} />;
    case 'OccupationalHealthcare':
      return <OccupationalEntryView entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry as never);
  }
};

export default EntryDetails;
