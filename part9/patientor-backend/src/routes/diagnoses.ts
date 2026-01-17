import express from 'express';
import { Response } from 'express';
import diagnosisService from '../services/diagnosisService';
import { Diagnosis } from '../types';

const router = express.Router();

router.get('/', (_req, res: Response<Diagnosis[]>) => {
  res.send(diagnosisService.getDiagnoses());
});

router.post('/', (_req, res) => {
  res.send('Saving a diagnosis.');
});

export default router;
