


import db from './db';
import cron from 'node-cron';
import nodemailer from 'nodemailer';

// Email Transporter (configure once)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Schedule job to run daily at 9 AM
cron.schedule('0 11 */7 * *', async () => {
  console.log('Running contract reminder job...');

  try {
      const [rows]: any = await db.execute(`
  SELECT *
  FROM employees
  WHERE
      end_date IS NOT NULL
      AND is_deleted = 0
      AND end_date <= DATE_ADD(NOW(), INTERVAL 4 MONTH)
`);

    if (Array.isArray(rows) && rows.length > 0) {
      for (const employee of rows) {
        const emails = [employee.email, employee.email2, employee.email3, employee.email4, employee.HR_Manager, employee.HR_Staff].filter(Boolean); // Filter out any null/undefined emails

        if (emails.length > 0) {
          try {
            await transporter.sendMail({
              to: emails.join(', '), // Send email to all emails as comma-separated values
              subject: 'Contract Expiry Reminder',
              html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #2E7D32; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">TechnoServe Ethiopia</h1>
                <p style="margin: 5px 0 0 0; font-size: 16px;">Contract Management System</p>
            </div>
            
            <div style="padding: 25px; background: #f9f9f9;">
                <h2 style="color: #2E7D32; margin-bottom: 20px;">Contract Expiry Notification</h2>
                
                <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #2E7D32;">
                    <p><strong>Dear HR Team,</strong></p>
                    
                    <p>This is to notify you that the contract for the following employee is approaching its end date:</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%;">Employee Name:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${employee.first_name} ${employee.middle_name || ''} ${employee.last_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Project:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">${employee.project}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Contract End Date:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee; color: #d32f2f; font-weight: bold;">${new Date(employee.end_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Days Remaining:</td>
                            <td style="padding: 8px; border-bottom: 1px solid #eee;">
                                ${Math.ceil((new Date(employee.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                            </td>
                        </tr>
                    </table>
                    
                    <p style="color: #d32f2f; font-weight: bold;">
                        ⚠️ Action Required: Please initiate contract renewal or termination procedures.
                    </p>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 5px;">
                    <p style="margin: 0; font-size: 14px; color: #2E7D32;">
                        <strong>Next Steps:</strong><br>
                        1. Review contract terms and performance<br>
                        2. Initiate renewal process if applicable<br>
                        3. Schedule exit procedures if terminating<br>
                        4. Update the system once decision is made
                    </p>
                </div>
                
                <p style="margin-top: 20px;">
                    This is an automated reminder from the Contract Management System.<br>
                    For any questions, please contact the HR Department.
                </p>
            </div>
            
            <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
                <p style="margin: 0;">
                    TechnoServe Ethiopia • Contract Management System<br>
                    This email was generated automatically. Please do not reply.
                </p>
            </div>
        </div>
    `,
            });
            console.log(`Email sent to ${emails.join(', ')}`);
          } catch (emailError) {
            console.error(`Failed to email ${emails.join(', ')}:`, emailError);
          }
        } else {
          console.log(`No valid emails for ${employee.first_name}`);
        }
      }
    } else {
      console.log('No expiring contracts found.');
    }
  } catch (error) {
    console.error('Cron job failed:', error);
  }
});
