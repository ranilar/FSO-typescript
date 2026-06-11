import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, List, ListItem, Divider } from '@mui/material';
import patientService from '../../services/patients';
import { Patient, Diagnosis } from '../../types';

const SinglePatientPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);

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
              <div>
                <div><strong>{entry.date}</strong></div>
                <div>{entry.description}</div>
                {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 ? (
                  <ul>
                    {entry.diagnosisCodes.map(code => {
                      const diag = diagnoses.find(d => d.code === code);
                      return (
                        <li key={code}>{code} {diag ? diag.name : ''}</li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            </ListItem>
          ))
        )}
      </List>
    </Container>
  );
};

export default SinglePatientPage;