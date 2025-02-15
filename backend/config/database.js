import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// const connection = await mysql.createConnection({
//     host: process.env.MYSQL_HOST,   // Corrected environment variables' syntax
//     user: process.env.MYSQL_USER,
//     password: process.env.MYSQL_PASSWORD,
//     database: process.env.MYSQL_DATABASE // Ensure this matches your environment variable
// });
export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

