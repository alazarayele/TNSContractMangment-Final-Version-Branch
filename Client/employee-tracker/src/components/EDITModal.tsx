import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem
} from '@mui/material';
import { Contract } from '../types/contract';

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  contract: Contract | null;
  onSave: (id: number, data: any) => void;
}

export const EditModal = ({ open, onClose, contract, onSave }: EditModalProps) => {
  const [formData, setFormData] = useState({
    project: '',
    end_date: '',
    line_manager:'',
    email2: '',
    email:''
  });

  useEffect(() => {
    if (contract) {
      setFormData({
        project: contract.project,
        end_date: contract.end_date.split('T')[0],// Format date,
       line_manager:contract.line_manager,
         email2:contract.email2 || '',
        email:contract.email

      });
    }
  }, [contract]);

  const handleSubmit = () => {
    if (contract) {
      onSave(contract.id!, formData);
    }
  };

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Edit Contract - {contract?.first_name} {contract?.last_name}
      </DialogTitle>
      
      <DialogContent>
        <TextField
          select
          fullWidth
          label="Project"
          value={formData.project}
          onChange={(e) => setFormData({...formData, project: e.target.value})}
          sx={{ mb: 2, mt: 1 }}
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
          type=""
          InputLabelProps={{ shrink: true }}
          value={formData.line_manager}
          onChange={(e) => setFormData({...formData, line_manager: e.target.value})}
          sx={{ mb: 2, mt: 1 }}
        />
          <TextField
          fullWidth
          label="Line Manager Email"
          type="textfield"
          InputLabelProps={{ shrink: true }}
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          sx={{ mb: 2, mt: 1 }}
        />
          <TextField
          fullWidth
          label="Budget Holder Email"
          type=""
          InputLabelProps={{ shrink: true }}
          value={formData.email2}
          onChange={(e) => setFormData({...formData, email2: e.target.value})}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          fullWidth
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.end_date}
          onChange={(e) => setFormData({...formData, end_date: e.target.value})}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};