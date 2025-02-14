import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJobSql } from "../controllers/application.controller.js";
 
const router = express.Router();
console.log("in application route 1")
router.route("/create").post(applyJobSql);
 

export default router;

