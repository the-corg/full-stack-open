import { Gender, NewPatient, HealthCheckRating } from './types';
import { z } from 'zod';

const DiagnosisCodeSchema = z.string().trim().min(1, { message: 'Diagnosis code is missing' });

const SickLeaveSchema = z.object({
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

const DischargeSchema = z.object({
  date: z.iso.date(),
  criteria: z.string().trim().min(1, { message: 'Discharge criteria are missing' }),
});

const NewBaseEntrySchema = z.object({
  description: z.string().trim().min(1, { message: 'Description is missing' }),
  date: z.iso.date(),
  specialist: z.string().trim().min(1, { message: 'Specialist is missing' }),
  diagnosisCodes: z.array(DiagnosisCodeSchema).optional(),
});

const NewHealthCheckEntrySchema = NewBaseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.enum(HealthCheckRating),
});

const NewOccupationalHealthcareEntrySchema = NewBaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string().trim().min(1, { message: 'Employer name is missing' }),
  sickLeave: SickLeaveSchema.optional(),
});

const NewHospitalEntrySchema = NewBaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: DischargeSchema,
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  NewHealthCheckEntrySchema,
  NewOccupationalHealthcareEntrySchema,
  NewHospitalEntrySchema,
]);

const HealthCheckEntrySchema = NewHealthCheckEntrySchema.extend({
  id: z.string(),
});

const OccupationalHealthcareEntrySchema = NewOccupationalHealthcareEntrySchema.extend({
  id: z.string(),
});

const HospitalEntrySchema = NewHospitalEntrySchema.extend({
  id: z.string(),
});

export const EntrySchema = z.discriminatedUnion('type', [
  HealthCheckEntrySchema,
  OccupationalHealthcareEntrySchema,
  HospitalEntrySchema,
]);

export const NewPatientSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is missing' }),
  dateOfBirth: z.iso.date(),
  ssn: z.string().trim().min(1, { message: 'SSN is missing' }),
  gender: z.enum(Gender),
  occupation: z.string().trim().min(1, { message: 'Occupation is missing' }),
  entries: z.array(EntrySchema),
});

export const toNewPatient = (object: unknown): NewPatient => NewPatientSchema.parse(object);
