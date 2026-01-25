import { Gender, Patient } from '../types';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import patientService from '../services/patients';
import { useEffect, useState } from 'react';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import FemaleIcon from '@mui/icons-material/Female';

type PatientPageProps = {
  diagnoses: Map<string, string>;
};

const PatientPage = ({ diagnoses }: PatientPageProps) => {
  const [patient, setPatient] = useState<Patient | undefined>(undefined);
  const id = useParams().id;

  useEffect(() => {
    const fetchPatientList = async () => {
      if (id) {
        const patient = await patientService.getById(id);
        setPatient(patient);
      }
    };
    void fetchPatientList();
  }, [id]);

  if (!patient) return <p>Patient not found</p>;

  return (
    <Box margin={'10px 0'}>
      <Typography align='left' margin={'20px 0'} variant='h5'>
        {patient.name}{' '}
        {patient.gender === Gender.Male ? (
          <MaleIcon />
        ) : patient.gender === Gender.Female ? (
          <FemaleIcon />
        ) : (
          <TransgenderIcon />
        )}
      </Typography>
      <Typography variant='body1'>date of birth: {patient.dateOfBirth}</Typography>
      <Typography variant='body1'>ssn: {patient.ssn}</Typography>
      <Typography variant='body1'>occupation: {patient.occupation}</Typography>
      <Box margin={'10px 0'}>
        <Typography variant='h6'>entries</Typography>
        {patient.entries.map(entry => (
          <Box key={entry.id}>
            <Typography variant='body2'>
              {entry.date} <i>{entry.description}</i>
            </Typography>
            <ul>
              {entry.diagnosisCodes?.map(code => (
                <li key={code}>
                  <Typography variant='body2'>
                    {code} {diagnoses.has(code) && diagnoses.get(code)}
                  </Typography>
                </li>
              ))}
            </ul>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PatientPage;
