import { Router } from "express";
import { check } from "express-validator";
import { upload, updateFile, getFile } from "../controllers/uploads.js";

import fieldValidator from "../middlewares/field_validator.js";

const router = Router();

router.post("/", upload);

router.put(
  "/:collection/:id",
  [
    check("id", "The id must be valid").isMongoId(),
    check("collection").custom((c) => {
      const validCollections = ["users", "products"];
      if (!validCollections.includes(c)) {
        throw new Error(
          `Invalid collection. Allowed collections are: ${validCollections.join(
            ", "
          )}`
        );
      }
      return true;
    }),
    fieldValidator,
  ],
  updateFile
);

router.get(
  "/:collection/:id",
  [
    check("id", "The id must be valid").isMongoId(),
    check("collection").custom((c) => {
      const validCollections = ["users", "products"];
      if (!validCollections.includes(c)) {
        throw new Error(
          `Invalid collection. Allowed collections are: ${validCollections.join(
            ", "
          )}`
        );
      }
      return true;
    }),
    fieldValidator,
  ],
  getFile
);



export default router;
