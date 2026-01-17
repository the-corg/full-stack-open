import patients from '../../data/patients';
import { Patient, SsnlessPatient } from '../types';

const getPatients = (): Patient[] => {
  return patients;
};

const getSsnlessPatients = (): SsnlessPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = () => {
  return null;
};

export default {
  getPatients,
  getSsnlessPatients,
  addPatient,
};
