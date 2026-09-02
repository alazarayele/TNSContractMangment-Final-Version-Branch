import { useEffect, useState } from 'react';
import { ContractTable } from '../components/ContractTable';
import { exportToCSV, fetchContracts,importFromCSV,updateContract,fetchHistory,fetchArchivedContracts } from '../services/api';
import { Contract } from '../types/contract';
import { deleteContract,restoreContract } from '../services/api';
import { useRef } from 'react'; // ← Add this import
import { EditModal } from '../components/EDITModal';
import { HistoryModal } from "../components/HistoryModal";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';




// Define type-safe styles
const styles: {
  container: React.CSSProperties;
  header: React.CSSProperties;
  title: React.CSSProperties;
  cardContainer: React.CSSProperties;
  card: React.CSSProperties;
  cardTitle: React.CSSProperties;
  cardValue: React.CSSProperties;
  tableContainer: React.CSSProperties;
  table: React.CSSProperties;
  tableHeader: React.CSSProperties;
  tableCell: React.CSSProperties;
  statusActive: React.CSSProperties;
  statusExpired: React.CSSProperties;
  statusDot: React.CSSProperties;
  actionButton: React.CSSProperties;
} = {
  container: {
    padding: '24px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: '#f9fafb',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#111827'
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  cardTitle: {
    color: '#6b7280',
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: '600'
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0',
    color: '#111827'
  },
  tableContainer: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    padding: '16px',
    textAlign: 'left' as const,
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  },
  tableCell: {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    color: '#4b5563'
  },
  statusActive: {
    color: '#10b981',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  statusExpired: {
    color: '#ef4444',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px'
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block'
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px'
  }
};

export const Dashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [archivedContracts,setArchivedContracts] = useState<Contract[]>([]);
  const [openArchivedModal,setOpenArchivedModal] = useState(false);
    const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openExpiringModal, setOpenExpiringModal] = useState(false);
const [openHistory, setOpenHistory] = useState(false);
const [history, setHistory] = useState([]);
const fileInputRef = useRef<HTMLInputElement>(null);
const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple hardcoded password
      setIsAuthenticated(true);
      localStorage.setItem('authenticated', 'true');
    } else {
      alert('Invalid password');
      setPassword('');
    }
  };

   const handleDelete= async (id:number)  => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      try {
        await deleteContract(id);
        setContracts(contracts.filter(contract => contract.id !== id));
        // You can add a success notification here

        const archived = await fetchArchivedContracts();
        setArchivedContracts(archived);

        alert("Contract archived successfully");
      } catch (error) {
        console.error('Error deleting contract:', error);
        alert('Failed to delete contract');
      }
    }
   };


   const handleRestore = async (id:number) => {

    try {
      await restoreContract(id);

      setArchivedContracts(
        archivedContracts.filter(contract => contract.id !== id)
      );

      const data = await fetchContracts();
      setContracts(data);

      alert("Contract to Restore SuccessFully");
    }

    catch (error)
    {
      console.error(error);
      alert("Failed to restore contracts");
    }

   };


    const loadarchivedContracts =async () => {
try{
  const data = await fetchArchivedContracts();
   setArchivedContracts(data);
  
}
catch(error){

  console.error(error);
  alert("Failed to load archived")
}
};

 useEffect(() => {
    const auth = localStorage.getItem('authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
     if (isAuthenticated) {
    const loadData = async () => {
      try {
        const data = await fetchContracts();
        setContracts(data);

         const archiveData = await fetchArchivedContracts();
        setArchivedContracts(archiveData);

      } catch (err) {
        setError('Failed to load contracts. Please try again later.');
        console.error('Fetch error:', err);
      } 
      finally {
        setLoading(false);
      }
    };

    loadData();
  }
  }, [isAuthenticated]);

  const activeContracts = contracts.filter(c => new Date(c.end_date) > new Date()).length;
   const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setIsEditModalOpen(true);
  };
  

  

const expiringContracts = contracts.filter(contract => {

   if (!contract.end_date) {
    return false;
  }

  const today = new Date();
  const fourMonthsLater = new Date();
  fourMonthsLater.setMonth(today.getMonth() + 4);

  const endDate = new Date(contract.end_date);

  return endDate >= today && endDate <= fourMonthsLater;
});


const handlearchivedContracts =async () => {

   setOpenArchivedModal(true);

};

const handleHistory = async (id: number) => {
  try {
    const data = await fetchHistory(id);
        console.log("#############");
    console.log(data);

    setHistory(data);

    setOpenHistory(true);

  } catch (error) {
    console.error(error);
    alert("Failed to load history");
  }
};

  const handleSave = async (id: number, updatedData: any) => {
    try {

       console.log('=== DEBUG: Starting Update Process ===');   // Get the full contract data
      const contractToUpdate = contracts.find(c => c.id === id);
      if (!contractToUpdate)
      {
         alert('Contract not found');
           return;
      }
       const formatDateForMySQL = (dateString: string) => {
      if (!dateString) return '';
      // If it's already in YYYY-MM-DD format, return as is
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
      }
       return dateString.split('T')[0];
    };

      // Merge existing data with updated fields
       const fullUpdatedData = {
         ...contractToUpdate,
         ...updatedData,

           start_date: formatDateForMySQL(contractToUpdate.start_date),
      end_date: formatDateForMySQL(updatedData.end_date)
        };


      console.log('📤 Data being sent to backend:', fullUpdatedData);
    console.log('🌐 API URL:', `http://localhost:5000/api/employees/${id}`);

      try {
      const response = await updateContract(id, fullUpdatedData);
      console.log('✅ Backend response:', response);
    } catch (apiError) {
      console.error('❌ API Call Failed:', apiError);
      throw apiError; // Re-throw to be caught by outer catch
    }
    
      
      // Update local state
      setContracts(contracts.map(contract => 
        contract.id === id 
          ? { ...contract, ...updatedData }
          : contract
      ));
      console.log('✅ Update successful');
      // Close modal
      setIsEditModalOpen(false);
      
    } catch (error:any) {
      console.error('Error updating contract:', error);
       console.error('Error name:', error.name);
    console.error('Error message:', error.message);
  if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
      alert(`Backend Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      alert('Network Error: No response from server. Is your backend running?');
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
      alert(`Request Error: ${error.message}`);
    }


      alert('Failed to update contract');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{ 
          background: '#fee2e2',
          color: '#b91c1c',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          {error}
                 </div>
                  <ContractTable 
                  
                  contracts={contracts} 
        onDelete={handleDelete}
        onEdit={handleEdit} 
        onHistory={handleHistory}
         />

      </div>
    );
  }
if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2>Contract Management System</h2>
          <p>Enter password to continue</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                padding: '10px',
                margin: '10px 0',
                width: '200px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
            <br />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Enter
            </button>
          </form>
          <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
            Password: <strong>Password</strong>
          </p>
        </div>
      </div>
    );
  }



   const handleExportCSV = async () => {
    try {
      const blob = await exportToCSV();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contracts_export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('✅ CSV exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('❌ Failed to export CSV');
    }
  };

  // Import from CSV function
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      alert('❌ Please select a CSV file');
      return;
    }

    if (!confirm('Import contracts from this CSV file?')) {
      return;
    }

    const importData = async () => {
      try {
        const result = await importFromCSV(file);
        
        if (result.errors && result.errors.length > 0) {
          alert(`✅ ${result.message}\n\nErrors:\n${result.errors.join('\n')}`);
        } else {
          alert(`✅ ${result.message}`);
        }
        
        // Refresh the contracts list
        const data = await fetchContracts();
        setContracts(data);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Import error:', error);
        alert('❌ Failed to import CSV');
      }
    };

    importData();
  };
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Contract Management Dashboard</h1>
         <div style={{ display: 'flex', gap: '10px' }}>
          {/* Export Button */}
          <button 
            onClick={handleExportCSV}
            style={{
              ...styles.actionButton,
              backgroundColor: '#28a745'
            }}
          >
            Export CSV
          </button>
           <button 
            onClick={() => fileInputRef.current?.click()}
            style={{
              ...styles.actionButton,
              backgroundColor: '#17a2b8'
            }}
          >
            Import CSV
          </button>
           <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportCSV}
            accept=".csv"
            style={{ display: 'none' }}
          />
        </div>
      
         <button 
          onClick={() => {
            localStorage.removeItem('authenticated');
            setIsAuthenticated(false);
          }}
          style={styles.actionButton}
        >
          Logout
        </button>

      </div>

      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Active Contracts</h3>
          <p style={styles.cardValue}>{activeContracts}</p>
        </div>
        <div
  style={{
    ...styles.card,
    cursor: 'pointer'
  }}
  onClick={() => setOpenExpiringModal(true)}
>
    <h3 style={styles.cardTitle}>Expiring Within 4 Months</h3>
    <p style={{ ...styles.cardValue, color: '#f59e0b' }}>
        {expiringContracts.length}
    </p>
</div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Total Contracts</h3>
          <p style={styles.cardValue}>{contracts.length}</p>
        </div>
        <div style={{
          ...styles.card,
          cursor: "pointer",
        }}
        onClick={() => setOpenArchivedModal(true)}>
          <h3 style={styles.cardTitle}> Archived Comtracts</h3>
          <p style={{...styles.cardValue,color:"#6b7280"}}>
                {archivedContracts.length}
          </p>

        </div>
      </div>
<ContractTable   

        contracts={contracts}
        onDelete={handleDelete}
        onEdit={handleEdit} 
        onHistory={handleHistory} />

 <EditModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        contract={editingContract}
        onSave={handleSave}
      />

       <HistoryModal
    open={openHistory}
    onClose={() => setOpenHistory(false)}
    history={history}
/>

  <Dialog
    open={openArchivedModal}
    onClose={() => setOpenArchivedModal(false)}
    maxWidth="lg"
    fullWidth
>
    <DialogTitle>
          Archived Contracts
    </DialogTitle>

    <DialogContent>
        <ContractTable
            contracts={archivedContracts}
            onDelete={handleDelete}
            onEdit={handleEdit} 
           onHistory={handleHistory} 
            archived={true} 
            onRestore={handleRestore} />
    </DialogContent>

    <DialogActions>
        <Button onClick={() => setOpenArchivedModal(false)}>
            Close
        </Button>
    </DialogActions>
</Dialog>


 <Dialog
    open={openExpiringModal}
    onClose={() => setOpenExpiringModal(false)}
    maxWidth="lg"
    fullWidth
>
    <DialogTitle>
        Contracts Expiring Within 4 Months
    </DialogTitle>

    <DialogContent>
        <ContractTable
            contracts={expiringContracts}
            onDelete={handleDelete}
            onEdit={handleEdit} 
           onHistory={handleHistory}   />
    </DialogContent>

    <DialogActions>
        <Button onClick={() => setOpenExpiringModal(false)}>
            Close
        </Button>
    </DialogActions>
</Dialog>
    
    </div>
  );
};