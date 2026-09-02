import { useEffect, useState } from "react";
import { fetchContracts } from "../services/api";
import { Contract } from "../types/contract";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  iconClasses,
  IconButton,Box
} from "@mui/material";

interface Props {
  contracts: Contract[];
  onDelete:(id: number) => void;
  onEdit: (contract: Contract) => void; // Add this
 }



export const ContractTable = ({ contracts, onDelete,onEdit }: Props) => {
  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell><b>Name</b></TableCell>
            <TableCell><b>Project</b></TableCell>
             <TableCell><b>Supervisor</b></TableCell>
             <TableCell><b>Supervisor Email</b></TableCell>
             <TableCell><b>BUdget Holder Email</b></TableCell>
            <TableCell><b>End Date</b></TableCell>
            <TableCell><b>Status</b></TableCell>
            
           <TableCell><b>ACTION</b></TableCell>  
             </TableRow>
        </TableHead>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id} hover>
              <TableCell>{contract.first_name}{contract.middle_name} {contract.last_name}</TableCell>
              <TableCell>{contract.project}</TableCell>
               <TableCell>{contract.line_manager}</TableCell>
               <TableCell>{contract.email}</TableCell>
                <TableCell>{contract.email2}</TableCell>
                 
              <TableCell>{new Date(contract.end_date).toLocaleDateString()}</TableCell>
              <TableCell>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    backgroundColor: new Date(contract.end_date) > new Date() ? '#e6ffed' : '#ffebee',
                    color: new Date(contract.end_date) > new Date() ? '#1b5e20' : '#c62828'
                  }}
                >
                  {new Date(contract.end_date) > new Date() ? "Active" : "Expired"}
                </span>
              </TableCell>
              
                 <TableCell>
                {/* EDIT BUTTON */}
                <IconButton 
                  color="primary" 
                  onClick={() => onEdit(contract)}
                  aria-label="edit"
                  size="small"
                  sx={{ mr: 1 }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                color="error"
                onClick={() => onDelete(contract.id)}
                aria-label="delete">
                  <DeleteIcon/>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};







