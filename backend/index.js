import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import applicationRoute from "./routes/application.route.js";
import companyRoute from "./routes/company.route.js";
import jobRouter from "./routes/job.route.js";
import { initializeUserTable, initializeProfileTable } from "./models/user_model_sql.js";
import { initializeJobTable } from "./models/job_model_sql.js";
import { initializeUserTableForApplication } from "./models/application_model_sql.js";
import { initializeCompanyTable } from "./models/company.model.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Ensure JSON requests are parsed
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
// app.use('/user',userRoute);
// API routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/application', applicationRoute);
app.use('/api/v1/company', companyRoute);
app.use('/api/v1/job', jobRouter);

// Initialize database tables
const initializeDatabaseTables = async () => {
    try {
        await initializeUserTable();
        await initializeProfileTable();
        await initializeCompanyTable();
        await initializeJobTable();
        await initializeUserTableForApplication();
        console.log("Database tables initialized");
    } catch (error) {
        console.error('Error initializing database tables:', error.stack);
    }
};

initializeDatabaseTables();

app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});


// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import dotenv from "dotenv";
// import userRoute from "./routes/user.route.js";
// import applicationRoute from "./routes/application.route.js";
// import comapnyRoute from "./routes/company.route.js";
// import jobRouter from "./routes/job.route.js"

// dotenv.config();
// const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// const corsOptions = {
//     origin: 'http://localhost:5173',
//     credentials: true
// };

// app.use(cors(corsOptions));

// const PORT = process.env.PORT || 8000;
// 
// app.use('/application',applicationRoute);
// app.use('/company',comapnyRoute);
// app.use('/job',jobRouter);


// app.listen(PORT,()=>{
//     console.log(`Server running at port ${PORT}`);
// })


// api's
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/company", comapnyRoute);
// app.use("/api/v1/job", jobRouter);
// app.use("/api/v1/application", applicationRoute);
// app.use(express.json());