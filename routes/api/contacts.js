const express = require("express");

const router = express.Router();

const { bodyValidation, idValidation } = require("../../middleware");
const {
  getAll,
  getById,
  add,
  remove,
  updateById,
  updateStatusContact,
} = require("../../controllers/contacts");
const { addSchema, updateSchema } = require("../../schemas/contact");

router.get("/", getAll);

router.get("/:contactId", idValidation, getById);

router.post("/", bodyValidation(addSchema), add);

router.delete("/:contactId", idValidation, remove);

router.put(
  "/:contactId",
  idValidation,
  bodyValidation(updateSchema),
  updateById
);

router.put(
  "/:contactId/favorite",
  idValidation,
  bodyValidation(updateSchema),
  updateStatusContact
);

module.exports = router;
