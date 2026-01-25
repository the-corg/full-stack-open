import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Button, Divider, Container, Typography } from '@mui/material';

import { apiBaseUrl } from './constants';
import { Diagnosis, Patient } from './types';

import patientService from './services/patients';
import diagnosisService from './services/diagnoses';
import PatientListPage from './components/PatientListPage';
import PatientPage from './components/PatientPage';

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnosesData: Diagnosis[] = await diagnosisService.getAll();
      const diagnoses: Map<string, string> = new Map();
      diagnosesData.map(d => diagnoses.set(d.code, d.name));
      setDiagnoses(diagnoses);
    };
    void fetchDiagnoses();
  }, []);

  return (
    <div className='App'>
      <Router>
        <Container>
          <Typography variant='h3' style={{ marginBottom: '0.5em' }}>
            Patientor
          </Typography>
          <Button component={Link} to='/' variant='contained' color='primary'>
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path='/patients/:id' element={<PatientPage diagnoses={diagnoses} />} />
            <Route
              path='/'
              element={<PatientListPage patients={patients} setPatients={setPatients} />}
            />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
