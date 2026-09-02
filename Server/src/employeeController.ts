// src/employeeController.ts
import { Request, Response } from 'express';
import db from './db';

// ✅ Explicitly export getAllEmployees
export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        const [rows]: any[] = await db.execute(
            'SELECT * FROM employees '
        );
        res.json(rows);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ✅ Explicitly export addEmployee
export const addEmployee = async (req: Request, res: Response) => {
    try {
        const { first_name, middle_name, last_name, start_date, end_date, project, line_manager, phone_number,email ,email2,email3,email4,HR_Manager,HR_Staff} = req.body;

        const query = `
            INSERT INTO employees (first_name, middle_name, last_name, start_date, end_date, project, line_manager, phone_number,email,email2,email3,email4,HR_Manager,HR_Staff)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?)
        `;

        await db.execute(query, [
            first_name, middle_name, last_name, start_date, end_date, project, line_manager, phone_number, email,email2,email3,email4,HR_Manager,HR_Staff
        ]);

        res.status(201).json({ message: "Employee added successfully" });
    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export const getArchivedEmployees = async (req:Request, res:Response) => {
    try {
        const [rows]: any[] =await db.execute(
            `SELECT * FROM employees WHERE is_deleted = 1 ORDER BY deleted_at DESC`
    );
    res.json(rows);
    }
    catch(error){
        console.error("Error Fetching archived employees:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
};
// Add this export at the bottom of employeeController.ts
export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;


        const [rows]: any = await db.execute(
    "SELECT * FROM employees WHERE id = ?",
    [id]
);

const oldData = rows[0];

        const query = `UPDATE employees
                        SET
                         is_deleted=1,
                         deleted_at = NOW(),
                         deleted_by = 'HR'
                         WHERE id = ?`;

        await db.execute(query, [id]);

        await db.execute(
    `
    INSERT INTO audit_logs
    (contract_id, action, changed_by, old_data, new_data)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
        id,
        "ARCHIVE",
        "Administrator",
        JSON.stringify(oldData),
        JSON.stringify({
            status: "Archived"
        })
    ]
);

        res.status(200).json({ message: "Employee Archived successfully" });
    } catch (error) {
        console.error("Error Archiving employee:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const restoreEmployee = async (req:Request, res: Response) => {
    try {
        const { id } = req.params;
        const query = `
        UPDATE employees
        SET
                is_deleted = 0,
                deleted_at = NULL,
                deleted_by = NULL
                Where id=?
        `;
        await db.execute(query,[id]);

        res.status(200).json({
            message:"employee restored Successfull"
        });
    } catch (error){
        console.error("Error restoring employee:", error);
        res.status(500).json({
            error:"Internal Server Error"
        });
    }
};

export const exportEmployeesCSV = async (req: Request, res: Response): Promise<void> => {
    try {
        const [rows]: any[] = await db.execute('SELECT * FROM employees');
        
        // Create CSV headers
        const headers = [
            'First Name', 'Middle Name', 'Last Name', 
            'Start Date', 'End Date', 'Project', 'Line Manager',
            'Phone Number', 'Email', 'Email 2', 'Email 3', 'Email 4','HR_Manager','HR_Staff'
        ];
        
        // Create CSV content
        let csvContent = headers.join(',') + '\n';
        
        rows.forEach((employee: any) => {
            const row = [
                `"${employee.first_name}"`,
                `"${employee.middle_name || ''}"`,
                `"${employee.last_name}"`,
                `"${employee.start_date}"`,
                `"${employee.end_date}"`,
                `"${employee.project}"`,
                `"${employee.line_manager || ''}"`,
                `"${employee.phone_number || ''}"`,
                `"${employee.email}"`,
                `"${employee.email2 || ''}"`,
                `"${employee.email3 || ''}"`,
                `"${employee.email4 || ''}"`,
                `"${employee.HR_Manager || ''}"`,
                `"${employee.HR_Staff || ''}"`
            ];
            csvContent += row.join(',') + '\n';
        });
        
        // Set response headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=contracts_export.csv');
        res.send(csvContent);
        
    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const importEmployeesCSV = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        
        const csvData = req.file.buffer.toString();
        const rows = csvData.split('\n').filter(row => row.trim());
        
        let importedCount = 0;
        let errors: string[] = [];
        
        // Function to parse various date formats to YYYY-MM-DD
        const parseDate = (dateString: string): string | null=> {
            if (!dateString) return null;
            
            // If already in YYYY-MM-DD format
            if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                return dateString;
            }
            
            // Try to parse different date formats
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD
            }
            
            return null; // Return empty if can't parse
        };

        // Skip header row (index 0)
        for (let i = 1; i < rows.length; i++) {
            try {
                const columns = rows[i].split(',').map(col => 
                    col.replace(/^"|"$/g, '').trim() // Remove quotes
                );
                
                if (columns.length < 9) { // At least required fields
                    errors.push(`Row ${i}: Insufficient data`);
                    continue;
                }
                
                // Map CSV columns to database fields
                const employeeData = {
                    first_name: columns[0] || '',
                    middle_name: columns[1] || null,
                    last_name: columns[2] || '',
                    start_date: parseDate(columns[3]), // Parse date format
                    end_date: parseDate(columns[4]),   // Parse date format
                    project: columns[5] || '',
                    line_manager: columns[6] || null,
                    phone_number: columns[7] || null,
                    email: columns[8] || '',
                    email2: columns[9] || null,
                    email3: columns[10] || null,
                    email4: columns[11] || null,
                     HR_Manager: columns[11] || null,
                      HR_Staff: columns[11] || null
                };
                
                // Validate required fields
                if (!employeeData.first_name || !employeeData.last_name || !employeeData.email) {
                    errors.push(`Row ${i}: Missing required fields (first name, last name, or email)`);
                    continue;
                }

                // Validate dates
                if (!employeeData.start_date || !employeeData.end_date) {
                    errors.push(`Row ${i}: Invalid date format. Use YYYY-MM-DD, MM/DD/YYYY, or full date names`);
                    continue;
                }
                
                const query = `
                    INSERT INTO employees (first_name, middle_name, last_name, start_date, end_date, project, line_manager, phone_number, email, email2, email3, email4,HR_Manager,HR_Staff)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
                `;
                
                await db.execute(query, [
                    employeeData.first_name,
                    employeeData.middle_name,
                    employeeData.last_name,
                    employeeData.start_date,
                    employeeData.end_date,
                    employeeData.project,
                    employeeData.line_manager,
                    employeeData.phone_number,
                    employeeData.email,
                    employeeData.email2,
                    employeeData.email3,
                    employeeData.email4,
                    employeeData.HR_Manager,
                    employeeData.HR_Staff
                ]);
                
                importedCount++;
                
            } catch (rowError) {
                errors.push(`Row ${i}: ${rowError}`);
            }
        }
        
        res.status(200).json({
            message: `Successfully imported ${importedCount} contracts`,
            errors: errors.length > 0 ? errors : undefined
        });
        
    } catch (error) {
        console.error('Error importing CSV:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Add this export at the bottom of employeeController.ts
export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('🔄 Backend: Starting employee update');
        const { id } = req.params;
        const updates = req.body;

        console.log('📥 Backend: Received ID:', id);
        console.log('📥 Backend: Received data:', updates);

         const [rows]: any = await db.execute(
    "SELECT * FROM employees WHERE id = ?",
    [id]
);

if (rows.length === 0) {
    res.status(404).json({ error: "Employee not found" });
    return;
}

const oldData = rows[0];
console.log(oldData);

        // Check if required fields are present
        const requiredFields = ['first_name', 'last_name', 'email', 'start_date', 'project','email2','line_manager'];
        const missingFields = requiredFields.filter(field => !updates[field]);
        
        if (missingFields.length > 0) {
            console.error('❌ Backend: Missing required fields:', missingFields);
            res.status(400).json({ 
                error: "Missing required fields", 
                missing: missingFields 
            });
            return; // Explicit return
        }

        const query = `
            UPDATE employees 
            SET first_name = ?, middle_name = ?, last_name = ?, 
                start_date = ?, end_date = ?, project = ?, 
                line_manager = ?, phone_number = ?, 
                email = ?, email2 = ?, email3 = ?, email4 = ?
            WHERE id = ?
        `;

        const values = [
            updates.first_name, 
            updates.middle_name || null, 
            updates.last_name, 
            updates.start_date, 
            updates.end_date || null, 
            updates.project, 
            updates.line_manager || null, 
            updates.phone_number || null, 
            updates.email, 
            updates.email2 || null, 
            updates.email3 || null, 
            updates.email4 || null,
            id
        ];

        console.log('📝 Backend: Executing query:', query);
        console.log('📝 Backend: With values:', values);

        await db.execute(query, values);

         const [newRows]: any = await db.execute(
    "SELECT * FROM employees WHERE id = ?",
    [id]
);

const newData = newRows[0];

// Save audit log
        // Save audit log
await db.execute(
    `
    INSERT INTO audit_logs
    (contract_id, action, changed_by, old_data, new_data)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
        id,
        "UPDATE",
        "HR", // Later replace with logged-in username
        JSON.stringify(oldData),
        JSON.stringify(newData)
    ]
);
 
console.log("📝 Audit log saved");

        console.log('✅ Backend: Employee updated successfully');
        res.status(200).json({ message: "Employee updated successfully" });

    } catch (error) {
        console.error("❌ Backend: Error updating employee:", error);
        
        // More detailed error logging
        if (error instanceof Error) {
            console.error("❌ Backend: Error message:", error.message);
            console.error("❌ Backend: Error stack:", error.stack);
        }
        
        res.status(500).json({ 
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};


export const getEmployeeHistory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [rows]: any = await db.execute(
            `
            SELECT *
            FROM audit_logs
            WHERE contract_id = ?
            ORDER BY created_at DESC
            `,
            [id]
        );

        res.json(rows);

    } catch (error) {
        console.error("Error fetching audit history:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};