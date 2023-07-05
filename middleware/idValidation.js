const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers");

const idValidation = (res, _, next) => {
  const { contactId } = res.params;
  isValidObjectId(contactId) ? next() : next(HttpError(404, "Not found"));
};

module.exports = idValidation;
