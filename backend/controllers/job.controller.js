import { Job } from "../models/job.model.js";
import { createJob, initializeJobTable, getAllJobs, getJobById, getAdminJobs } from "../models/job_model_sql.js";

// admin post krega job
export const registerJobSql = async (req, res) => {
    try {
        console.log("connection call:", req.body);
        await initializeJobTable();
        console.log("call create job");

        const { title, description, requirements, salary, experience_level, location, job_type, position, company_id } = req.body;

        if (!title || !description || !requirements || !salary || !experience_level || !location || !job_type || !position || !company_id) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        const jobId = await createJob({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            experience_level: Number(experience_level),
            location,
            job_type,
            position: Number(position),
            company_id
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job: { id: jobId, title, description, requirements, salary, experience_level, location, job_type, position, company_id },
            success: true
        });
    } catch (error) {
        console.error('Error registering job:', error.stack);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getAllJobsSql = async (req, res) => {
    try {
        console.log("Fetching all jobs...");
        
        const jobs = await getAllJobs();

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error('Error fetching all jobs:', error.stack);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
export const getJobByIdSql = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Fetching job with ID: ${id}`);
        const job = await getJobById(id);
        if (!job) {
            return res.status(404).json({ message: "Job not found.", success: false });
        }
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error('Error fetching job by ID:', error.stack);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const getAdminJobsSql = async (req, res) => {
    try {
        const adminId = req.userId;
        console.log(`Fetching jobs created by admin with ID: ${adminId}`);
        const jobs = await getAdminJobs(adminId);
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ message: "Jobs not found.", success: false });
        }
        return res.status(200).json({ jobs, success: true });
    } catch (error) {
        console.error('Error fetching admin jobs:', error.stack);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};
