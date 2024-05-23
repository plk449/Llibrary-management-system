import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";



const router = express.Router();

router.get("/", (req, res) => {
    res.send("Test Success");
})

router.route("/register").post(registerUser)
// router.post("/register",registerUser)

router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser)
router.route("/changepassword").post(verifyJWT, changeCurrentPassword)
router.route("/updateDetail").patch(verifyJWT, updateAccountDetails)
router.route("/profile").get(verifyJWT, getCurrentUser)


export default router