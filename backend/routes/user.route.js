import express from "express";
import { deleteUserSql, getUserSqlById, loginUsersql, logoutUsersql, registerSql, updateUserProfileSql} from "../controllers/user.controller.js";
// import { singleUpload } from "../middlewares/mutler.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
 
const router = express.Router();
console.log("in user routes");
router.route("/register").post(registerSql);
router.route("/login").post(isAuthenticated,loginUsersql);
router.route("/logout").post(logoutUsersql);
router.route("/delete/:id").delete(deleteUserSql);
router.get('/:id', getUserSqlById);
// router.route('/:id/profile').put(isAuthenticated,updateUserProfileSql);
router.route('/profile/update').post(isAuthenticated, updateUserProfileSql);

export default router;

