import { Gender, NewPatient } from './types';

const isString = (text: unknown): text is string =>
  typeof text === 'string' || text instanceof String;

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) throw new Error('Incorrect or missing name');

  return name;
};

const isDate = (date: string): boolean => Boolean(Date.parse(date));

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) throw new Error('Incorrect or missing date: ' + date);

  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn) || !ssn.includes('-')) throw new Error('Incorrect or missing ssn');

  return ssn;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map(v => v.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender))
    throw new Error('Incorrect or missing gender: ' + gender);

  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) throw new Error('Incorrect or missing occupation');

  return occupation;
};

const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') throw new Error('Incorrect or missing data');

  if (
    !('name' in object) ||
    !('dateOfBirth' in object) ||
    !('ssn' in object) ||
    !('gender' in object) ||
    !('occupation' in object)
  )
    throw new Error('Incorrect data: some fields are missing');

  const newPatient: NewPatient = {
    name: parseName(object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseSsn(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
  };

  return newPatient;
};

export default toNewPatient;
