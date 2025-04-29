import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const corsOptions = {
    origin: ['http://localhost:5173', 'https://job-portal-sql.vercel.app'],
    credentials: true
};
app.use(cors(corsOptions));

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

export default app;
