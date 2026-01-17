import { Gender, NewPatient } from './types';
import { z } from 'zod';

export const NewPatientSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is missing' }),
  dateOfBirth: z.iso.date(),
  ssn: z.string().trim().min(1, { message: 'SSN is missing' }),
  gender: z.enum(Gender),
  occupation: z.string().trim().min(1, { message: 'Occupation is missing' }),
});

export const toNewPatient = (object: unknown): NewPatient => NewPatientSchema.parse(object);
