import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
// import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/mutler.js";
import { registerCompanySql, getCompanySql, updateCompanySql} from "../controllers/company.controller.js";

const router = express.Router();
router.route("/register").post(registerCompanySql);
router.route("/getCompany").get(getCompanySql);
router.route("/getCompany/:id").get(getCompanySql);
router.route("/update/:id").put(updateCompanySql);

// router.route("/register").post(isAuthenticated,registerCompany);
// router.route("/get").get(isAuthenticated,getCompany);
// router.route("/get/:id").get(isAuthenticated,getCompanyById);
// router.route("/update/:id").put(isAuthenticated,singleUpload, updateCompany);

export default router;

