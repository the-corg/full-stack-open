export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3,
}

export interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck';
  healthCheckRating: HealthCheckRating;
}

export interface SickLeaveData {
  startDate: string;
  endDate: string;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: 'OccupationalHealthcare';
  employerName: string;
  sickLeave?: SickLeaveData;
}

export interface DischargeData {
  date: string;
  criteria: string;
}

export interface HospitalEntry extends BaseEntry {
  type: 'Hospital';
  discharge: DischargeData;
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, 'id'>;

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entries without the 'id' property
export type HealthCheckEntryFormValues = UnionOmit<HealthCheckEntry, 'id'>;
export type HospitalEntryFormValues = UnionOmit<HospitalEntry, 'id'>;
export type OccupationalHealthcareEntryFormValues = UnionOmit<OccupationalHealthcareEntry, 'id'>;

export type EntryFormValues =
  | HealthCheckEntryFormValues
  | HospitalEntryFormValues
  | OccupationalHealthcareEntryFormValues;
