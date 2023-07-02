const express = require("express");

const router = express.Router();

const { bodyValidation } = require("../../middleware");
const {
  getAll,
  getById,
  add,
  remove,
  updateById,
} = require("../../controllers/contacts");
const { addSchema, updateSchema } = require("../../schemas/contact");

router.get("/", getAll);

router.get("/:contactId", getById);

router.post("/", bodyValidation(addSchema), add);

router.delete("/:contactId", remove);

router.put("/:contactId", bodyValidation(updateSchema), updateById);

module.exports = router;
