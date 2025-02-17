import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { registerCompanySql, getCompanySql, updateCompanySql, getCompanyByIdSql } from "../controllers/company.controller.js";
// import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, registerCompanySql);
router.route("/get").get(isAuthenticated, getCompanySql);
router.route("/get/:id").get(isAuthenticated, getCompanyByIdSql); // Add getCompanySqlById function
router.route("/update/:id").put(isAuthenticated, updateCompanySql);

export default router;




