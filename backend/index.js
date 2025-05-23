import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import {pool} from "../config/database.js";
import userRoute from "./routes/user.route.js";
import applicationRoute from "./routes/application.route.js";
import companyRoute from "./routes/company.route.js";
import jobRouter from "./routes/job.route.js";
import { initializeUserTable, initializeProfileTable, initializeOtpTable } from "./models/user_model_sql.js";
import { initializeJobTable } from "./models/job_model_sql.js";
import { initializeUserTableForApplication } from "./models/application_model_sql.js";
import { initializeCompanyTable } from "./models/company.model.js";

dotenv.config();

const app = express();


app.get('/api/health', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        res.status(200).json({ 
            status: 'ok', 
            message: 'Backend is running and database is connected' 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            message: 'Database connection failed',
            error: error.message 
        });
    }
});
const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/v1/user', userRoute);
app.use('/api/v1/application', applicationRoute);
app.use('/api/v1/company', companyRoute);
app.use('/api/v1/job', jobRouter);

// Health check route for deployment verification
// app.get('/api/health', (req, res) => {
//     res.status(200).json({ status: 'ok', message: 'Backend is running' });
// });

export const initializeDatabaseTables = async () => {
    try {
        await initializeUserTable();
        await initializeProfileTable();
        await initializeCompanyTable();
        await initializeJobTable();
        await initializeUserTableForApplication();
        await initializeOtpTable();
        console.log("Database tables initialized");
    } catch (error) {
        console.error('Error initializing database tables:', error.stack);
    }
};

export default app;
