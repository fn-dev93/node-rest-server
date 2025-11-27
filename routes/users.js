import { Router } from "express";
import {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers,
} from "../controllers/users.js";

const router = Router();

router.get("/", getUsers);

router.post("/", postUsers);

router.put("/:id", putUsers);

router.patch("/:id", patchUsers);

router.delete("/:id", deleteUsers);
export default router;
