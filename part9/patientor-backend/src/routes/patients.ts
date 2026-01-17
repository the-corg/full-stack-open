import express from 'express';
import { Response } from 'express';
import patientService from '../services/patientService';
import { SsnlessPatient } from '../types';
import toNewPatient from '../utils';

const router = express.Router();

router.get('/', (_req, res: Response<SsnlessPatient[]>) => {
  res.send(patientService.getSsnlessPatients());
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
