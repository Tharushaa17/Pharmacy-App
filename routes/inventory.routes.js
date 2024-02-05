import express from "express";
import { verifyRoles } from "../middelware/verifyRoles.js";
import { ROLES_LIST } from "../utils/roleList.js";
import { verifyToken } from "../middelware/verifyToken.js";
import {
  createInventory,
  getAllInventory,
  hardDeleteInventory,
  searchInventory,
  softDeleteInventory,
  updateInventory,
} from "../controllers/inventory.controller.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  verifyRoles(ROLES_LIST.Owner),
  createInventory
);
router.patch(
  "/update/:id",
  verifyToken,
  verifyRoles(ROLES_LIST.Owner, ROLES_LIST.Manager, ROLES_LIST.Cashier),
  updateInventory
);
router.delete(
  "/soft-delete/:id",
  verifyToken,
  verifyRoles(ROLES_LIST.Owner, ROLES_LIST.Manager),
  softDeleteInventory
);
router.delete(
  "/hard-delete/:id",
  verifyToken,
  verifyRoles(ROLES_LIST.Owner),
  hardDeleteInventory
);
router.get(
  "/get",
  verifyToken,
  verifyRoles(ROLES_LIST.Owner, ROLES_LIST.Manager, ROLES_LIST.Cashier),
  getAllInventory
);
router.get(
  "/search/:id",
  verifyToken,
  verifyRoles(ROLES_LIST.Owner, ROLES_LIST.Manager, ROLES_LIST.Cashier),
  searchInventory
);

export default router;
