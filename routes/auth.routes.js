import express from "express";
import {
  singOut,
  refreshToken,
  singIn,
  signUp,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/sign-up", signUp);
router.post("/sign-in", singIn);
router.get("/sign-out", singOut);
router.get("/refresh", refreshToken);

export default router;
