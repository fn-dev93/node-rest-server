import { Router } from "express";
import { check } from "express-validator";

import { fieldValidator, validateJWT, validateRole } from "../middlewares/index.js";
import {
  deleteCategory,
  getCategories,
  getCategoryById,
  postCategory,
  updateCategory,
} from "../controllers/categories.js";
import { categoryIdExists } from "../helpers/db_validations.js";

const router = Router();

router.get("/", getCategories);

router.get(
  "/:id",
  [
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(categoryIdExists),
    fieldValidator,
  ],
  getCategoryById
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "The name is required").not().isEmpty(),
    fieldValidator,
  ],
  postCategory
);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(categoryIdExists),
    check("name", "Name is required").not().isEmpty(),
    fieldValidator,
  ],
  updateCategory
);

router.delete(
  "/:id",
  [
    validateJWT,
    validateRole,
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(categoryIdExists),
    fieldValidator,
  ],
  deleteCategory,
);

export default router;
