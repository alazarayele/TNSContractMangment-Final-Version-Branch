
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  history: any[];
}

export const HistoryModal = ({
  open,
  onClose,
  history,
}: HistoryModalProps) => {

  const getChangedFields = (oldData: any, newData: any) => {
    const changes = [];

    for (const key in oldData) {
      if (oldData[key] !== newData[key]) {
        changes.push({
          field: key,
          oldValue: oldData[key],
          newValue: newData[key]
        });
      }
    }

    return changes;
  };
  return (
    
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Contract History</DialogTitle>

      <DialogContent>
        
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            
            {history.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.created_at).toLocaleString()}
                </TableCell>

                <TableCell>{log.changed_by}</TableCell>

                <TableCell>{log.action}</TableCell>
              
                <TableCell colSpan={2}>
  {getChangedFields(log.old_data, log.new_data).map((change: any) => (
    <div key={change.field} style={{ marginBottom: "10px" }}>
      <strong>{change.field}</strong>

      <br />

      {String(change.oldValue)}

      <br />

      ↓

      <br />

      {String(change.newValue)}
    </div>
  ))}
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};