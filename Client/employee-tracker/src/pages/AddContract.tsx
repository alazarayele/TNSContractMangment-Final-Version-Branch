import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addContract } from '../services/api';
import { 
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  MenuItem,
  Alert,
  Box
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  CalendarToday as DateIcon,
  Work as ProjectIcon
} from '@mui/icons-material';

export const AddContract = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    start_date: '',
    end_date: '',
    project: '',
    line_manager: '',
    phone_number: '',
    email: '',
    email2: '',
    email3: 'myohanes@tns.org',
    email4: 'myekunoamlak@tns.org',
    HR_Manager:'sendrias@tns.org',
    HR_Staff:'tsiont@tns.org'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const projects = [
    'Coffee Initiative',
    'CREW',
    'CREW and REGROW',
    'H4G',
    'IGNITE',
    'Nespresso',
    'Nespresso and CREW',
    'Nespresso/CREW',
    'Regrow',
    'Regrow yirga',
    'Shared',
    'Souk'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.first_name || !formData.last_name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    try {
       await addContract({
  ...formData,
  end_date: formData.end_date || null,
});
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Failed to add contract. Please try again.');
      console.error('Error adding contract:', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Add New Contract
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>Contract added successfully!</Alert>}

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            '& > *': {
              flex: '1 1 300px'
            }
          }}
        >
          {/* Personal Information */}
          <TextField
            fullWidth
            label="First Name *"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Middle Name"
            name="middle_name"
            value={formData.middle_name}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Last Name *"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />

          {/* Contact Information */}
          <TextField
            fullWidth
            label="Budget HolderEmail *"
            name="email2"
            type="email"
            value={formData.email2}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
            
  <TextField
            fullWidth
            label="ManagerEmail *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Project Information */}
          <TextField
            select
            fullWidth
            label="Project *"
            name="project"
            value={formData.project}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ProjectIcon />
                </InputAdornment>
              ),
            }}
          >
            {projects.map((project) => (
              <MenuItem key={project} value={project}>
                {project}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Line Manager"
            name="line_manager"
            value={formData.line_manager}
            onChange={handleChange}
          />

          {/* Dates */}
          <TextField
            fullWidth
            label="Start Date"
            name="start_date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.start_date}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="End Date *"
            name="end_date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.end_date}
            onChange={handleChange}
            
          />

          {/* Submit Button */}
          <Box sx={{ flex: '0 0 100%', display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="success"
              size="large"
              sx={{ px: 5 }}
            >
              Add Contract
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};