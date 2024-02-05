import express from "express";
import { verifyRoles } from "../middelware/verifyRoles.js";
import { ROLES_LIST } from "../utils/roleList.js";
import { verifyToken } from "../middelware/verifyToken.js";
import {
  createCustomer,
  getAllCustomer,
  hardDeleteCustomer,
  searchCustomer,
  softDeleteCustomer,
  updateCustomer,
} from "../controllers/customer.controller.js";
const router = express.Router();

router.post(
  "/create",
  verifyToken,
  verifyRoles(ROLES_LIST.Owner),
  createCustomer
);
router.patch(
  "/update/:id",
  verifyToken,
  verifyRoles(ROLES_LIST.Owner, ROLES_LIST.Manager, ROLES_LIST.Cashier),
  updateCustomer
);
router.delete(
  "/soft-delete/:id",
  verifyToken,
  verifyRoles(ROLES_LIST.Owner, ROLES_LIST.Manager),
  softDeleteCustomer
);
router.delete(
  "/hard-delete/:id",
  verifyToken,
  verifyRoles(ROLES_LIST.Owner),
  hardDeleteCustomer
);
router.get(
  "/get",
  verifyToken,
  verifyRoles(ROLES_LIST.Owner, ROLES_LIST.Manager, ROLES_LIST.Cashier),
  getAllCustomer
);
router.get(
  "/search/:id",
  verifyToken,
  verifyRoles(ROLES_LIST.Owner, ROLES_LIST.Manager, ROLES_LIST.Cashier),
  searchCustomer
);

export default router;
