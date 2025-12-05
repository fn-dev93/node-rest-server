import { Router } from "express";
import { check } from "express-validator";

import { fieldValidator, validateJWT, validateRole } from "../middlewares/index.js";
import {
  postProduct,
  getProducts ,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/products.js";
import { categoryIdExists, productIdExists } from "../helpers/db_validations.js";

const router = Router();

router.get("/", getProducts);

router.get(
  "/:id",
  [
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(productIdExists),
    fieldValidator,
  ],
  getProductById
);

router.post(
  "/",
  [
    validateJWT,
    check("name", "The name is required").not().isEmpty(),
    check("price", "The price must be a number").isNumeric(),
    check("category", "Invalid category ID").isMongoId(),
    check("category").custom(categoryIdExists),
    fieldValidator,
  ],
  postProduct
);

router.put(
  "/:id",
  [
    validateJWT,
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(productIdExists),
    fieldValidator,
  ],
  updateProduct
);

router.delete(
  "/:id",
  [
    validateJWT,
    validateRole,
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(productIdExists),
    fieldValidator,
  ],
  deleteProduct,
);

export default router;
