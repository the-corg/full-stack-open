import { Entry } from '../types';
import HospitalEntryDetails from './Entries/HospitalEntryDetails';
import OccupationalHealthcareEntryDetails from './Entries/OccupationalHealthcareEntryDetails';
import HealthCheckEntryDetails from './Entries/HealthCheckEntryDetails';
import { assertNever } from '../utils';

type EntryDetailsProps = {
  entry: Entry;
  diagnoses: Map<string, string>;
};

const EntryDetails = ({ entry, diagnoses }: EntryDetailsProps) => {
  switch (entry.type) {
    case 'Hospital':
      return <HospitalEntryDetails entry={entry} diagnoses={diagnoses} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcareEntryDetails entry={entry} diagnoses={diagnoses} />;
    case 'HealthCheck':
      return <HealthCheckEntryDetails entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
