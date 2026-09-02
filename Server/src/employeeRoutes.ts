// src/employeeRoutes.ts
import express from 'express';
import multer from 'multer'; 
import { getAllEmployees, addEmployee, deleteEmployee,updateEmployee,exportEmployeesCSV,
    importEmployeesCSV,  
    getEmployeeHistory,
    getArchivedEmployees,
    restoreEmployee} from './employeeController'; // ✅ Correct path

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
router.get('/', getAllEmployees);
router.get('/archive',getArchivedEmployees);
router.put('/:id/restore',restoreEmployee);
router.get('/:id/history', getEmployeeHistory);
router.post('/add', addEmployee); // ✅ Now addEmployee is recognized
router.delete('/:id', deleteEmployee);
router.put('/:id', updateEmployee);  // NOT router.post


router.get('/export/csv', exportEmployeesCSV);
router.post('/import/csv', upload.single('file'), importEmployeesCSV);
export default router;