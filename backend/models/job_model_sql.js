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
export const initializeJobTable = async () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS jobs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            requirements TEXT NOT NULL,
            salary DECIMAL(10,2) NOT NULL,
            experience_level INT NOT NULL,
            location VARCHAR(255) NOT NULL,
            job_type VARCHAR(255) NOT NULL,
            position INT NOT NULL,
            company_id INT NOT NULL,
            posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
        )
    `;
    const connection = await pool.getConnection();
    await connection.query(sql);
    connection.release();
};



export const createJob = async (job) => {
    const sql = "INSERT INTO jobs (title, description, requirements, salary, experience_level, location, job_type, position, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [job.title, job.description, job.requirements, job.salary, job.experience_level, job.location, job.job_type, job.position, job.company_id];

    const connection = await pool.getConnection();
    const [result] = await connection.execute(sql, values);
    connection.release();
    return result.insertId;
};

// Get all jobs
export const getAllJobs = async () => {
    const sql = "SELECT * FROM jobs";
    let connection;

    try {
        console.log("Fetching all jobs");
        connection = await pool.getConnection();
        const [rows] = await connection.execute(sql);
        return rows;
    } catch (error) {
        console.error('Error fetching all jobs:', error);
        throw error; // Rethrow the error so it can be handled by the caller
    } finally {
        if (connection) {
            connection.release();
        }
    }
};
export const getJobById = async (id) => {
    const sql = "SELECT * FROM jobs WHERE id = ?";
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(sql, [id]);
        return rows[0]; // Return the job
    } catch (error) {
        console.error('Error fetching job by ID:', error);
        throw error; // Rethrow the error so it can be handled by the caller
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
// export const getAdminJobs = async (adminId) => {
//     try {
//         if (!adminId) {
//             throw new Error("Admin ID is required");
//         }
//         console.log(`Fetching jobs created by admin with ID: ${adminId}`);
//         const query = 'SELECT * FROM jobs WHERE admin_id = ?';
//         const [rows] = await pool.execute(query, [adminId]);
//         return rows;
//     } catch (error) {
//         console.error('Error fetching admin jobs:', error);
//         throw error;
//     }
// };

// export const getAdminJobs = async (adminId) => {
//     const sql = `
//         SELECT jobs.*, companies.*
//         FROM jobs
//         INNER JOIN companies ON jobs.company_id = companies.id
//         WHERE jobs.created_by = ?
//         ORDER BY jobs.created_at DESC
//     `;
//     let connection;
//     try {
//         connection = await pool.getConnection();
//         const [rows] = await connection.execute(sql, [adminId]);
//         return rows;
//     } catch (error) {
//         console.error('Error fetching admin jobs:', error);
//         throw error; // Rethrow the error so it can be handled by the caller
//     } finally {
//         if (connection) {
//             connection.release();
//         }
//     }
// };

