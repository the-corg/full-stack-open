import { HealthCheckEntry } from '../../types';
import { Box, Typography } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';

type HealthCheckEntryDetailsProps = {
  entry: HealthCheckEntry;
  diagnoses: Map<string, string>;
};

const HealthRatingColor = ['limegreen', 'gold', 'darkorange', 'red'];

const HealthCheckEntryDetails = ({ entry, diagnoses }: HealthCheckEntryDetailsProps) => (
  <Box sx={{ border: 1, borderColor: 'grey.400', borderRadius: '10px', margin: '10px 0' }}>
    <div>
      <Typography variant='body2' margin={'10px 0 0 10px'}>
        {entry.date} <MedicalServicesIcon />
      </Typography>
      <Typography variant='body2' margin={'0 10px'}>
        <i>{entry.description}</i>
      </Typography>
      <FavoriteIcon sx={{ color: HealthRatingColor[entry.healthCheckRating], margin: '0 10px' }} />
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
  </Box>
);

export default HealthCheckEntryDetails;
