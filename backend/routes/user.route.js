import express from "express";
import { registerSql} from "../controllers/user.controller.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();
console.log("in user routes");
router.route("/register").post(singleUpload,registerSql);

export default router;

