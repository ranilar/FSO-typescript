import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';


import { apiBaseUrl } from "./constants";
import { Patient, Diagnosis } from "./types";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import SinglePatientPage from "./components/SinglePatientPage";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    const fetchDiagnoses = async () => {
      const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
      setDiagnoses(data);
    };
    void fetchPatientList();
    void fetchDiagnoses();
  }, []);
  
  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" sx={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider sx={{ marginY: 2 }} />
          <Routes>
            <Route path="/" element={<PatientListPage patients={patients} setPatients={setPatients} />} />
            <Route path="/patients/:id" element={<SinglePatientPage diagnoses={diagnoses} />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
