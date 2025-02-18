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

export const initializeCompanyTable = async () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS companies (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NULL,
            website VARCHAR(255) NULL,
            location VARCHAR(255) NULL,
            logo VARCHAR(255) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    const connection = await pool.getConnection();
    try {
        await connection.query(sql);
        console.log('Table "companies" created or updated successfully.');
    } catch (err) {
        console.error('Error creating or updating table "companies":', err.stack);
    } finally {
        connection.release();
    }
};

export const checkCompanyExists = async (name) => {
    const sql = "SELECT * FROM companies WHERE name = ?";
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(sql, [name]);
        return rows.length > 0; // Return true if company exists
    } catch (err) {
        console.error('Error checking company existence:', err.stack);
        throw err;
    } finally {
        connection.release();
    }
};
// Insert a new company
export const createCompany = async (company) => {
    const sql = "INSERT INTO companies (name, description, website, location, logo) VALUES (?, ?, ?, ?, ?)";
    const values = [company.name, company.description, company.website, company.location, company.logo];

    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(sql, values);
        console.log('Company created successfully with ID:', result.insertId);
        return result.insertId;
    } catch (err) {
        console.error('Error creating company:', err.stack);
        throw err;
    } finally {
        connection.release();
    }
};


// Get all companies
export const getAllCompanies = async () => {
    const sql = "SELECT * FROM companies";
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(sql);
        return rows;
    } catch (err) {
        console.error('Error retrieving companies:', err.stack);
        throw err;
    } finally {
        connection.release();
    }
};

export const getCompanyById = async (id) => {
    const sql = "SELECT * FROM companies WHERE id = ?";
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(sql, [id]);
        return rows[0];
    } catch (err) {
        console.error('Error retrieving company by ID:', err.stack);
        throw err;
    } finally {
        connection.release();
    }
};

export const updateCompanyById = async (id, updateData) => {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updateData)) {
        fields.push(`${key} = ?`);
        values.push(value);
    }

    values.push(id); // Add the id to the end of the values array for the WHERE clause
    const sql = `UPDATE companies SET ${fields.join(', ')} WHERE id = ?`;

    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(sql, values);
        return result.affectedRows > 0; // Return true if the company was updated
    } catch (err) {
        console.error('Error updating company:', err.stack);
        throw err;
    } finally {
        connection.release();
    }
};

export const getCompanyIdByName = async (name) => {
    try {
        const sql = "SELECT id FROM companies WHERE name = ?";
        const [rows] = await pool.query(sql, [name]);
        if (rows.length > 0) {
            return rows[0].id;
        }
        return null;
    } catch (error) {
        console.error('Error fetching company ID:', error);
        throw error;
    }
};