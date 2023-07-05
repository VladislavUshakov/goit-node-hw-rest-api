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
const { joiSchemas } = require("../../models/contact");

router.get("/", getAll);

router.get("/:contactId", idValidation, getById);

router.post("/", bodyValidation(joiSchemas.addContact), add);

router.delete("/:contactId", idValidation, remove);

router.put(
  "/:contactId",
  idValidation,
  bodyValidation(joiSchemas.updateContact),
  updateById
);

router.patch(
  "/:contactId/favorite",
  idValidation,
  bodyValidation(joiSchemas.updateContact),
  updateStatusContact
);

module.exports = router;
