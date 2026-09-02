import { useEffect, useState } from "react";
import { fetchContracts } from "../services/api";
import { Contract } from "../types/contract";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import RestorePageIcon from '@mui/icons-material/RestorePage';
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
  onHistory: (id: number) => void;
  archived?:boolean;
  onRestore?:(id :number) => void;
 }



export const ContractTable = ({ contracts, onDelete,onEdit,onHistory,archived = false,onRestore }: Props) => {
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
                 
              <TableCell>
  {contract.end_date
    ? new Date(contract.end_date).toLocaleDateString()
    : (
      <span
        style={{
          color: "#1976d2",
          fontWeight: "bold"
        }}
      >
        Open Ended
      </span>
    )}
</TableCell>
              <TableCell>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    backgroundColor: new Date(contract.end_date) > new Date() ? '#e6ffed' : '#ffebee',
                    color: new Date(contract.end_date) > new Date() ? '#1b5e20' : '#c62828'
                  }}
                >
                   {
                  
                  !contract.end_date
    ? "Open Ended"
    : new Date(contract.end_date) > new Date()
    ? "Active"
    : "Expired"}
                </span>
              </TableCell>
              
                <TableCell>
                {/* EDIT BUTTON */}

                {!archived && (

                  <>
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
                </>

)}
{archived && (
                <IconButton
                color="success"
               onClick={() => onRestore?.(contract.id)}
                >
                  <RestorePageIcon/>
                </IconButton>

                )}
                <IconButton
    color="info"
    onClick={() => onHistory(contract.id)}
    aria-label="history"
    size="small"
    sx={{ mr: 1 }}
>
    <HistoryIcon fontSize="small" />
</IconButton>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};







