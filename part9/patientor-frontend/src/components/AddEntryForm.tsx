import { Box, Button, MenuItem, Select, TextField, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import { Entry, HealthCheckRating } from '../types';
import patientService from '../services/patients';
import { EntryFormValues } from '../types';
import { assertNever } from '../utils';
import axios from 'axios';

type AddEntryFormProps = {
  patientId: string;
  onAddEntry: (entry: Entry) => void;
};

const AddEntryForm = ({ patientId, onAddEntry }: AddEntryFormProps) => {
  const [type, setType] = useState<Entry['type']>('HealthCheck');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(0);

  const [error, setError] = useState<string | null>(null);

  const resetFields = () => {
    setError(null);
    setDescription('');
    setDate('');
    setSpecialist('');
    setDiagnosisCodes('');
    setDischargeDate('');
    setDischargeCriteria('');
    setEmployerName('');
    setSickLeaveStart('');
    setSickLeaveEnd('');
    setHealthCheckRating(0);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const base = {
      description,
      date,
      specialist,
      diagnosisCodes:
        diagnosisCodes.length > 0 ? diagnosisCodes.split(',').map(c => c.trim()) : undefined,
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
          onChange={e => setDate(e.target.value)}
          sx={{ margin: '5px 0' }}
        />
        <TextField
          label='Specialist'
          value={specialist}
          onChange={e => setSpecialist(e.target.value)}
          sx={{ margin: '5px 0' }}
        />
        <TextField
          fullWidth
          label='Diagnosis codes (comma separated)'
          value={diagnosisCodes}
          onChange={e => setDiagnosisCodes(e.target.value)}
          sx={{ margin: '5px 0' }}
        />
        {type === 'HealthCheck' && (
          <TextField
            label='Health rating (0-3)'
            type='number'
            value={healthCheckRating}
            onChange={e => setHealthCheckRating(Number(e.target.value))}
            sx={{ margin: '5px 0' }}
          />
        )}
        {type === 'Hospital' && (
          <>
            <TextField
              label='Discharge date'
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
              value={sickLeaveStart}
              onChange={e => setSickLeaveStart(e.target.value)}
              sx={{ margin: '5px 0' }}
            />
            <TextField
              label='Sick leave end'
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
