import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobsSql, getAllJobsSql, getJobByIdSql, registerJobSql } from "../controllers/job.controller.js";

const router = express.Router();
router.route("/post").post(isAuthenticated, registerJobSql); // Adjusted route name
router.route("/get").get(isAuthenticated, getAllJobsSql);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobsSql);
router.route("/get/:id").get(isAuthenticated, getJobByIdSql);

export default router;
