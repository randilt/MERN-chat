import express from "express";
import { login, logout, signup } from "../controllers/auth.controllers.js";

const router = express.Router();

router.get("/login", login);
router.get("/logout", logout);
router.get("/signup", signup);

export default router;
