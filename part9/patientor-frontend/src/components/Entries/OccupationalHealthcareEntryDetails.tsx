import { OccupationalHealthcareEntry } from '../../types';
import { Box, Typography } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import WorkOffIcon from '@mui/icons-material/WorkOff';

type OccupationalHealthcareEntryDetailsProps = {
  entry: OccupationalHealthcareEntry;
  diagnoses: Map<string, string>;
};

const OccupationalHealthcareEntryDetails = ({
  entry,
  diagnoses,
}: OccupationalHealthcareEntryDetailsProps) => (
  <Box sx={{ border: 1, borderColor: 'grey.400', borderRadius: '10px', margin: '10px 0' }}>
    <div>
      <Typography variant='body2' margin={'10px 0 0 10px'}>
        {entry.date} <WorkIcon /> <i>{entry.employerName}</i>
      </Typography>
      <Typography variant='body2' margin={'0 10px'}>
        <i>{entry.description}</i>
      </Typography>
      <Typography variant='body2' margin={'10px'}>
        diagnosed by {entry.specialist}
      </Typography>
    </div>
    <ul>
      {entry.diagnosisCodes?.map(code => (
        <li key={code}>
          <Typography variant='body2'>
            {code} {diagnoses.has(code) && diagnoses.get(code)}
          </Typography>
        </li>
      ))}
    </ul>
    {entry.sickLeave && (
      <Typography variant='body2' margin={'10px'}>
        <WorkOffIcon /> Sick leave from {entry.sickLeave?.startDate} to {entry.sickLeave?.endDate}
      </Typography>
    )}
  </Box>
);

export default OccupationalHealthcareEntryDetails;
