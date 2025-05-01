import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000, // Increase timeout to 60 seconds
    ssl: process.env.NODE_ENV === 'production' ? {} : false
});

// Test database connection
export const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to the database!');
        connection.release();
        return true;
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
        return false;
    }
};

