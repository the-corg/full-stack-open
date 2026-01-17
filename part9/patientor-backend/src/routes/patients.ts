import express from 'express';
import { Response } from 'express';
import patientService from '../services/patientService';
import { SsnlessPatient } from '../types';

const router = express.Router();

router.get('/', (_req, res: Response<SsnlessPatient[]>) => {
  res.send(patientService.getSsnlessPatients());
});

router.post('/', (req, res) => {
  const { name, dateOfBirth, ssn, gender, occupation } = req.body;
  const addedPatient = patientService.addPatient({
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation,
  });
  res.json(addedPatient);
});

export default router;
