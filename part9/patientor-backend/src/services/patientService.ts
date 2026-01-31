import patients from '../../data/patients-full';
import { Patient, SsnlessPatient, NewPatient, NewEntry, Entry } from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => patients;

const getSsnlessPatients = (): SsnlessPatient[] =>
  patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));

const findById = (id: string): Patient | undefined => patients.find(p => p.id === id);

const addPatient = (patient: NewPatient): Patient => {
  const id = uuid();
  const newPatient = {
    id,
    ...patient,
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patient: Patient, entry: NewEntry): Entry => {
  const id = uuid();
  const newEntry = {
    id,
    ...entry,
  };
  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getSsnlessPatients,
  findById,
  addPatient,
  addEntry,
};
