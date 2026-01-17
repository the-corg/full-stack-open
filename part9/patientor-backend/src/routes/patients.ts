import express from 'express';
import { Response, Request, NextFunction } from 'express';
import patientService from '../services/patientService';
import { Patient, NewPatient, SsnlessPatient } from '../types';
import { NewPatientSchema } from '../utils';
import { z } from 'zod';

const router = express.Router();

router.get('/', (_req, res: Response<SsnlessPatient[]>) => {
  res.send(patientService.getSsnlessPatients());
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    let errorMessage = 'Something went wrong.';
    for (const issue of error.issues) errorMessage += ' Error: ' + issue.message;

    res.status(400).send(errorMessage);
  } else next(error);
};

router.post(
  '/',
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    res.json(patientService.addPatient(req.body));
  },
);

router.use(errorMiddleware);

export default router;
