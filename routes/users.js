import { Router } from "express";
import { check } from "express-validator";
import {
  getUsers,
  postUsers,
  putUsers,
  patchUsers,
  deleteUsers,
} from "../controllers/users.js";
import {
  isValidRole,
  emailExists,
  userIdExists,
} from "../helpers/db_validations.js";
import { fieldValidator, validateJWT, validateRole } from "../middlewares/index.js";

const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  [
    check("email", "Valid email is required").isEmail(),
    check("password", "Password with min 6 characters is required").isLength({
      min: 6,
    }),
    check("name", "Name is required").not().isEmpty(),
    check("role", "Role is required").not().isEmpty(),
    check("role").custom(isValidRole),
    check("email").custom(emailExists),
    fieldValidator,
  ],
  postUsers
);

router.put(
  "/:id",
  [
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(userIdExists),
    check("role").custom(isValidRole),
    fieldValidator,
  ],
  putUsers
);

router.patch("/:id", patchUsers);

router.delete(
  "/:id",
  [
    validateJWT,
    validateRole,
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(userIdExists),
    fieldValidator,
  ],
  deleteUsers
);

export default router;
