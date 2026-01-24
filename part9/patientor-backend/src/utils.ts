import { Gender, NewPatient, HealthCheckRating } from './types';
import { z } from 'zod';

const DiagnosisCodeSchema = z.string();

const BaseEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.iso.date(),
  specialist: z.string(),
  diagnosisCodes: z.array(DiagnosisCodeSchema).optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.enum(HealthCheckRating),
});

const SickLeaveSchema = z.object({
  startDate: z.iso.date(),
  endDate: z.iso.date(),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string(),
  sickLeave: SickLeaveSchema.optional(),
});

const DischargeSchema = z.object({
  date: z.iso.date(),
  criteria: z.string(),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: DischargeSchema,
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
