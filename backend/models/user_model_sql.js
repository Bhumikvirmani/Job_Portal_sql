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
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            fullname VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phoneNumber VARCHAR(20) NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('student', 'recruiter') NOT NULL,
            profile JSON NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    const connection = await pool.getConnection();
    await connection.query(sql);
    // console.log(connection);
    connection.release();
};

export const initializeProfileTable = async () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS profiles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            bio TEXT,
            skills JSON,
            resume VARCHAR(255),
            resumeOriginalName VARCHAR(255),
            company_id INT,
            profilePhoto VARCHAR(255) DEFAULT '',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
        )
    `;
    const connection = await pool.getConnection();
    await connection.query(sql);
    console.log("Profiles table initialized");
    connection.release();
};



export const createUser = async (user) => {
    const sql = "INSERT INTO users (fullname, email, phoneNumber, password, role) VALUES (?, ?, ?, ?, ?)";
    const values = [user.fullname, user.email, user.phoneNumber, user.password, user.role];
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(sql, values);
        const userId = result.insertId;

        // Create a profile with optional fields
        const profileSql = "INSERT INTO profiles (user_id, bio, skills, resume, resumeOriginalName, company_id, profilePhoto) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const profileValues = [
            userId,
            user.profile?.bio || '',
            JSON.stringify(user.profile?.skills || []),
            user.profile?.resume || '',
            user.profile?.resumeOriginalName || '',
            user.profile?.company || null,
            user.profile?.profilePhoto || ''
        ];
        await connection.execute(profileSql, profileValues);

        return userId;
    } catch (err) {
        console.error('Error creating user:', err.stack);
        throw err;
    } finally {
        connection.release();
    }
};

export const getUserByEmail = async (email) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(sql, [email]);
    connection.release();
    return rows[0]; // Return the first user found
};

export const updateUserProfile = async (userId, userUpdate) => {
    const checkUserSql = "SELECT id FROM users WHERE id = ?";
    const updateUserSql = `
        UPDATE users 
        SET fullname = COALESCE(?, fullname), 
            email = COALESCE(?, email), 
            phoneNumber = COALESCE(?, phoneNumber)
        WHERE id = ?
    `;
    const updateProfileSql = `
        INSERT INTO profiles (user_id, bio, skills, profilePhoto)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        bio = VALUES(bio),
        skills = VALUES(skills),
        profilePhoto = VALUES(profilePhoto)
    `;
    const connection = await pool.getConnection();
    try {
        // Check if user exists in users table
        const [rows] = await connection.execute(checkUserSql, [userId]);
        if (rows.length === 0) {
            throw new Error(`User with ID ${userId} does not exist`);
        }

        // Update user information
        await connection.execute(updateUserSql, [
            userUpdate.fullname || null,
            userUpdate.email || null,
            userUpdate.phoneNumber || null,
            userId
        ]);

        // Update profile information
        await connection.execute(updateProfileSql, [
            userId,
            userUpdate.profile.bio || null,
            JSON.stringify(userUpdate.profile.skills || []),
            userUpdate.profile.profilePhoto || null
        ]);
    } catch (err) {
        console.error('Error updating user profile:', err.stack);
        throw err;
    } finally {
        connection.release();
    }
};

// export const updateUserProfile = async (userId, profile) => {
//     const checkUserSql = "SELECT id FROM users WHERE id = ?";
//     const sql = `
//         INSERT INTO profiles (user_id, bio, skills, resume, resumeOriginalName, company_id, profilePhoto)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//         ON DUPLICATE KEY UPDATE
//         bio = VALUES(bio),
//         skills = VALUES(skills),
//         resume = VALUES(resume),
//         resumeOriginalName = VALUES(resumeOriginalName),
//         company_id = VALUES(company_id),
//         profilePhoto = VALUES(profilePhoto)
//     `;
//     const values = [
//         userId,
//         profile.bio || '',
//         JSON.stringify(profile.skills || []),
//         profile.resume || '',
//         profile.resumeOriginalName || '',
//         profile.company || null,
//         profile.profilePhoto || ''
//     ];
//     const connection = await pool.getConnection();
//     try {
//         // Check if user_id exists in users table
//         const [rows] = await connection.execute(checkUserSql, [userId]);
//         if (rows.length === 0) {
//             throw new Error(`User with ID ${userId} does not exist`);
//         }

//         // Update profile
//         await connection.execute(sql, values);
//     } catch (err) {
//         console.error('Error updating user profile:', err.stack);
//         throw err;
//     } finally {
//         connection.release();
//     }
// };

export const getUserById = async (userId) => {
    const sql = `
        SELECT users.*, profiles.*
        FROM users
        LEFT JOIN profiles ON users.id = profiles.user_id
        WHERE users.id = ?
    `;
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute(sql, [userId]);
        return rows[0]; // Return the user with profile details
    } catch (err) {
        console.error('Error fetching user by ID:', err.stack);
        throw err;
    } finally {
        connection.release();
    }
};

export const deleteUserById = async (userId) => {
    const sql = "DELETE FROM users WHERE id = ?";
    const connection = await pool.getConnection();
    try {
        await connection.execute(sql, [userId]);
    } catch (err) {
        console.error('Error deleting user:', err.stack);
        throw err;
    } finally {
        connection.release();
    }
};