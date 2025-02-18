// import { Application } from "../models/application.model.js";
import {createApplication, applywithid, getApplicationsByJob, updateApplicationStatus, getApplicants, getAppliedJobs } from "../models/application_model_sql.js";
import { Job } from "../models/job.model.js";

export const applyJobSql = async (req, res) => {
    try {
        const userId = req.userId; // Assuming userId is set by authentication middleware
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        // Check if the user has already applied for the job
        const existingApplications = await getApplicationsByJob(jobId);
        const userApplied = existingApplications.some(app => app.user_id === userId);

        if (userApplied) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // Check if the job exists
        const job = await getJobById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Create a new application
        // const applicationData = {
        //     job_id: jobId,
        //     user_id: userId,
        //     resume: "resume_url", // Placeholder, adapt as needed
        //     status: "pending"
        // };
        // await createApplication(applicationData);
        const newApplication = await createApplication({
            job_id: jobId,
            user_id: userId,
            resume: "resume_url", // Placeholder, adapt as needed
            status: "pending"
        });
        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });
    } catch (error) {
        console.log('Error applying for job:', error.stack);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const applyWithIdController = async (req, res) => {
    try {
        console.log("Connection call for apply with ID controller: ", req.body);
        const applicationId = await applywithid(req.body);
        console.log(applicationId);
        res.status(201).json({ applicationId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to apply with ID" });
    }
};

export const getApplicationsByJobController = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        console.log("Connection call for get applications by job controller: ", jobId);
        const applications = await getApplicationsByJob(jobId);
        if (applications.length === 0) {
            return res.status(404).json({
                message: "No applications found.",
                success: false
            });
        }
        console.log(applications);
        res.status(200).json({ applications, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to get applications by job ID" });
    }
};
export const updateStatusSql = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({
                message: 'Status is required',
                success: false
            });
        }

        // Update the status
        await updateApplicationStatus(applicationId, status);

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });
    } catch (error) {
        console.error('Error updating application status:', error.stack);
        if (error.message === "Application not found") {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getApplicantsSql = async (req, res) => {
    try {
        const jobId = req.params.id;
        console.log("Connection call for get applicants controller: ", jobId);
        const applications = await getApplicants(jobId);
        if (applications.length === 0) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }
        console.log(applications);
        res.status(200).json({
            applications,
            success: true
        });
    } catch (error) {
        console.log('Error getting applicants:', error.stack);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getAppliedJobsSql = async (req, res) => {
    try {
        const userId = req.params.id;

        // Ensure userId is a valid number
        if (isNaN(userId)) {
            return res.status(400).json({
                message: "Invalid user ID",
                success: false
            });
        }

        const appliedJobs = await getAppliedJobs(userId);

        return res.status(200).json({
            message: "Applied jobs retrieved successfully",
            appliedJobs,
            success: true
        });
    } catch (error) {
        console.error('Error getting applied jobs:', error.stack);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};