import { Router } from "express";
import { check } from "express-validator";

import fieldValidator from "../middlewares/field_validator.js";
import { login, googleSignIn } from "../controllers/auth.js";

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

router.post(
  "/google",
  [check("id_token", "ID token is required").not().isEmpty(), fieldValidator],
  googleSignIn
);

export default router;
