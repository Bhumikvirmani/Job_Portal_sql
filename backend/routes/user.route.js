import express from "express";
import { loginUsersql, logoutUser, registerSql} from "../controllers/user.controller.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();
console.log("in user routes");
router.route("/register").post(singleUpload,registerSql);
router.route("/login").post(loginUsersql);
router.route("/logout").post(logoutUser);


export default router;

