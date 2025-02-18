import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJobSql, getApplicantsSql, getApplicationsByJobController, getAppliedJobsSql, updateStatusSql } from "../controllers/application.controller.js";

const router = express.Router();
console.log("in application route 1");

router.route("/apply/:id").post(isAuthenticated, applyJobSql); // Adjusted to use .get() for consistency
router.route("/get").get(isAuthenticated, getAppliedJobsSql);
router.route("/job/:jobId/applications").get(isAuthenticated, getApplicationsByJobController);
router.route("/status/:id/update").post(isAuthenticated, updateStatusSql);
router.route("/:id/applicants").get(isAuthenticated, getApplicantsSql);

export default router;
