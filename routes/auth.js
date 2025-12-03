import { Router } from "express";
import { check } from "express-validator";

import fieldValidator from "../middlewares/field_validator.js";
import { login } from "../controllers/auth.js";

const router = Router();

router.post(
  "/login",
  [
    check("email", "Valid email is required").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    fieldValidator,
  ],
  login
);

export default router;
