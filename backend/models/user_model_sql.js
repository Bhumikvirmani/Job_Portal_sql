// import pool from "../config/database";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
// Create the users table if it doesn't exist
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
export const initializeUserTable = async () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS users2 (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullname VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phoneNumber VARCHAR(20) NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(20) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    const connection = await pool.getConnection();
    await connection.query(sql);
    // console.log(connection);
    connection.release();
}

export const createUser = async (user) => {
    const sql = "INSERT INTO users (fullname, email, phoneNumber, password, role) VALUES (?, ?, ?, ?, ?)";
    const values = [user.fullname, user.email, user.phoneNumber, user.password, user.role];
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(sql, values);
        return result.insertId;
    } catch (err) {
        console.error('Error creating user:', err.stack);
        throw err;
    } finally {
        connection.release();
    }
};

// // Get a user by email
// export const getUserByEmail = async (email) => {
//     const sql = "SELECT * FROM users WHERE email = ?";
//     const connection = await pool.getConnection();
//     const [rows] = await connection.execute(sql, [email]);
//     connection.release();
//     return rows[0]; // Return the first user found
// };

// export async function createNote(title, contents){
//   const [result] = await connection.query(`
//     Insert into notes(title,contents)
//     values(?,?)
//     `,[title,contents])
//     const id = result.insertId;
//     return getNodeid(id);
// }
// Insert a new user
// export const createUser = async (user) => {
//     const sql = "INSERT INTO users (fullname, email, phoneNumber, password, role) VALUES (?, ?, ?, ?, ?)";
//     // const values = [user.fullname, user.email, user.phoneNumber, user.password, user.role, JSON.stringify(user.profile)];
//     const values = ["bhumik", "virmanibhumik@gmail.com, 58038349, "test123", "student"];

//     const connection = await pool.getConnection();
//     const [result] = await connection.execute(sql, values);
//     connection.release();
//     return result.insertId;
// };