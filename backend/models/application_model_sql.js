
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Create Applications table
export const initializeUserTableForApplication = async () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS applications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            job_id INT NOT NULL,
            user_id INT NOT NULL,
            resume VARCHAR(255) NOT NULL,
            status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending',
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    const connection = await pool.getConnection();
    await connection.query(sql);
    connection.release();
};

// Insert a new application
export const createApplication = async (application) => {
    const sql = "INSERT INTO applications (job_id, user_id, resume, status) VALUES (?, ?, ?, ?)";
    const values = [application.job_id, application.user_id, application.resume, application.status];

    const connection = await pool.getConnection();
    const [result] = await connection.execute(sql, values);
    connection.release();
    console.log("application insert");
    return result.insertId;
};

// // Get applications for a job
export const getApplicationsByJob = async (job_id) => {
    const sql = "SELECT * FROM applications WHERE job_id = ?";
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(sql, [job_id]);
    connection.release();
    return rows;
};