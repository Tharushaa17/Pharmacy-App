import express from "express";
import {
  deleteUser,
  getAllUsers,
  searchUser,
  updateUser,
} from "../controllers/users.controller.js";
import { verifyToken } from "../middelware/verifyToken.js";
const router = express.Router();

router.patch("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/get", verifyToken, getAllUsers);
router.get("/search/:id", verifyToken, searchUser);

export default router;
