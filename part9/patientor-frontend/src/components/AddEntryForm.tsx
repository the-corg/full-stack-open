import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { useState } from 'react';
import { Entry, HealthCheckRating, EntryFormValues } from '../types';
import patientService from '../services/patients';
import { assertNever } from '../utils';
import axios from 'axios';

type AddEntryFormProps = {
  patientId: string;
  diagnoses: Map<string, string>;
  onAddEntry: (entry: Entry) => void;
};

const AddEntryForm = ({ patientId, diagnoses, onAddEntry }: AddEntryFormProps) => {
  const [type, setType] = useState<Entry['type']>('HealthCheck');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [dischargeDate, setDischargeDate] = useState(new Date().toISOString().split('T')[0]);
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState(new Date().toISOString().split('T')[0]);
  const [sickLeaveEnd, setSickLeaveEnd] = useState(new Date().toISOString().split('T')[0]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(0);

  const [error, setError] = useState<string | null>(null);

  const resetFields = () => {
    setError(null);
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setSpecialist('');
    setDiagnosisCodes([]);
    setDischargeDate(new Date().toISOString().split('T')[0]);
    setDischargeCriteria('');
    setEmployerName('');
    setSickLeaveStart(new Date().toISOString().split('T')[0]);
    setSickLeaveEnd(new Date().toISOString().split('T')[0]);
    setHealthCheckRating(0);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const base = {
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
    };

    let entry: EntryFormValues;

    switch (type) {
      case 'HealthCheck':
        entry = { ...base, type: 'HealthCheck', healthCheckRating };
        break;
      case 'Hospital':
        entry = {
          ...base,
          type: 'Hospital',
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        };
        break;
      case 'OccupationalHealthcare':
        entry = {
          ...base,
          type: 'OccupationalHealthcare',
          employerName,
          sickLeave:
            sickLeaveStart && sickLeaveEnd
              ? { startDate: sickLeaveStart, endDate: sickLeaveEnd }
              : undefined,
        };
        break;
      default:
        assertNever(type);
        return;
    }

    try {
      const savedEntry = await patientService.createEntry(patientId, entry);
      onAddEntry(savedEntry);
      resetFields();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data ?? 'Unknown axios error');
        return;
      } else {
        setError('Unknown error');
        return;
      }
    }
  };

  return (
    <>
      {error && (
        <Alert severity='error' sx={{ margin: '5px 0' }}>
          {error}
        </Alert>
      )}
      <Box
        component='form'
        onSubmit={handleSubmit}
        sx={{ border: 'dotted', borderColor: 'grey.500', padding: '10px', margin: '10px 0' }}
      >
        <Select
          value={type}
          onChange={e => setType(e.target.value as Entry['type'])}
          sx={{ margin: '5px 0' }}
        >
          <MenuItem value='HealthCheck'>Health check</MenuItem>
          <MenuItem value='Hospital'>Hospital</MenuItem>
          <MenuItem value='OccupationalHealthcare'>Occupational healthcare</MenuItem>
        </Select>
        <Typography variant='h6' margin='10px 0'>
          New {type} entry
        </Typography>
        <TextField
          fullWidth
          label='Description'
          value={description}
          onChange={e => setDescription(e.target.value)}
          sx={{ margin: '5px 0' }}
        />
        <TextField
          label='Date'
          value={date}
          type='date'
          InputLabelProps={{ shrink: true }}
          onChange={e => setDate(e.target.value)}
          sx={{ margin: '5px 0' }}
        />
        <TextField
          label='Specialist'
          value={specialist}
          onChange={e => setSpecialist(e.target.value)}
          sx={{ margin: '5px 0' }}
        />
        <FormControl fullWidth sx={{ margin: '5px 0' }}>
          <InputLabel>Diagnosis codes</InputLabel>
          <Select
            multiple
            value={diagnosisCodes}
            onChange={e =>
              setDiagnosisCodes(
                typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value,
              )
            }
            input={<OutlinedInput label='Diagnosis codes' />}
            renderValue={selected => selected.join(', ')}
          >
            {[...diagnoses.entries()].map(([code, name]) => (
              <MenuItem key={code} value={code}>
                <Checkbox checked={diagnosisCodes.indexOf(code) > -1} />
                <ListItemText primary={`${code} ${name}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {type === 'HealthCheck' && (
          <TextField
            label='Health rating'
            type='number'
            inputProps={{ min: 0, max: 3 }}
            value={healthCheckRating}
            onChange={e => setHealthCheckRating(Number(e.target.value))}
            sx={{ margin: '5px 0', width: 100 }}
          />
        )}
        {type === 'Hospital' && (
          <>
            <TextField
              label='Discharge date'
              type='date'
              InputLabelProps={{ shrink: true }}
              value={dischargeDate}
              onChange={e => setDischargeDate(e.target.value)}
              sx={{ margin: '5px 0' }}
            />
            <TextField
              label='Discharge criteria'
              value={dischargeCriteria}
              onChange={e => setDischargeCriteria(e.target.value)}
              sx={{ margin: '5px 0' }}
            />
          </>
        )}
        {type === 'OccupationalHealthcare' && (
          <>
            <TextField
              label='Employer name'
              value={employerName}
              onChange={e => setEmployerName(e.target.value)}
              sx={{ margin: '5px 0' }}
            />
            <TextField
              label='Sick leave start'
              type='date'
              InputLabelProps={{ shrink: true }}
              value={sickLeaveStart}
              onChange={e => setSickLeaveStart(e.target.value)}
              sx={{ margin: '5px 0' }}
            />
            <TextField
              label='Sick leave end'
              type='date'
              InputLabelProps={{ shrink: true }}
              value={sickLeaveEnd}
              onChange={e => setSickLeaveEnd(e.target.value)}
              sx={{ margin: '5px 0' }}
            />
          </>
        )}
        <Box display='flex' justifyContent='space-between' sx={{ margin: '5px 0' }}>
          <Button variant='contained' color='error' onClick={resetFields}>
            Cancel
          </Button>
          <Button type='submit' variant='contained' color='success'>
            Add
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default AddEntryForm;
