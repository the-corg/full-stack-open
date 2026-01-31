import { HospitalEntry } from '../../types';
import { Box, Typography } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WavingHandIcon from '@mui/icons-material/WavingHand';

type HospitalEntryDetailsProps = {
  entry: HospitalEntry;
  diagnoses: Map<string, string>;
};

const HospitalEntryDetails = ({ entry, diagnoses }: HospitalEntryDetailsProps) => (
  <Box sx={{ border: 1, borderColor: 'grey.400', borderRadius: '10px', margin: '10px 0' }}>
    <div>
      <Typography variant='body2' margin={'10px 0 0 10px'}>
        {entry.date} <LocalHospitalIcon />
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
    <Typography variant='body2' margin={'10px'}>
      <WavingHandIcon /> Discharged on {entry.discharge.date}. Reason:{' '}
      <i>{entry.discharge.criteria}</i>
    </Typography>
  </Box>
);

export default HospitalEntryDetails;
