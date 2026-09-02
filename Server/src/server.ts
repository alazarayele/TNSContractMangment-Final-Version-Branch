import express from 'express';
import cors from 'cors';
import employeeRoutes from './employeeRoutes';
import './cron'; 
import * as cron from 'node-cron'; // Add this line
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);

// ✅ Add this route for the root (`/`)
app.get('/', (req, res) => {
    res.send('Server is running! 🚀');
});

//app.listen(PORT, () => {
//console.log(`Server running on http://localhost:${PORT}`);
//});

app.listen(5000, '0.0.0.0', () => {
  console.log("Server running on port 5000");
});

cron.schedule('* * * * *', () => {
    console.log('Cron job running!');
  });
