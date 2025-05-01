import { pool } from './config/database.js';

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the database!');
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

testConnection();