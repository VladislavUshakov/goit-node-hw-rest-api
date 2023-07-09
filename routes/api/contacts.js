const express = require("express");

const router = express.Router();

const {
  bodyValidation,
  idValidation,
  authentication,
} = require("../../middleware");

const cntrl = require("../../controllers/contacts");

const { schemas } = require("../../models/contact");

router.get("/", authentication, cntrl.getAll);

router.get("/:contactId", authentication, idValidation, cntrl.getById);

router.post("/", authentication, bodyValidation(schemas.addSchema), cntrl.add);

router.delete("/:contactId", authentication, idValidation, cntrl.remove);

router.put(
  "/:contactId",
  authentication,
  idValidation,
  bodyValidation(schemas.updateSchema),
  cntrl.updateById
);

router.patch(
  "/:contactId/favorite",
  authentication,
  idValidation,
  bodyValidation(schemas.updateSchema),
  cntrl.updateStatusContact
);

module.exports = router;
