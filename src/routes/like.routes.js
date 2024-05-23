import express from "express";
import {
    toggleLike
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/L", (req, res) => {
    res.send("Test like Success");
})

router.route("/like").post(verifyJWT,toggleLike);




export default router