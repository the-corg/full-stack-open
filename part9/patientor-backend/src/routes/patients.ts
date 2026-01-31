import express from 'express';
import { Response, Request, NextFunction } from 'express';
import patientService from '../services/patientService';
import { Patient, NewPatient, SsnlessPatient, NewEntry, Entry } from '../types';
import { NewEntrySchema, NewPatientSchema } from '../utils';
import { z } from 'zod';

const router = express.Router();

router.get('/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);

  if (patient) res.send(patient);
  else res.sendStatus(404);
});

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

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
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
  '/:id/entries',
  newEntryParser,
  (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry>) => {
    const patient = patientService.findById(req.params.id);

    if (!patient) return res.sendStatus(404);

    return res.json(patientService.addEntry(patient, req.body));
  },
);

router.post(
  '/',
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    res.json(patientService.addPatient(req.body));
  },
);

router.use(errorMiddleware);

export default router;
