const contacts = require("../models/contacts");
const { HttpError, cntrlWrapper } = require("../helpers");

const getAll = async (_, res) => {
  const contactsList = await contacts.listContacts();
  res.json(contactsList);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);

  if (!contact) {
    throw HttpError(404, "Not found");
  }

  res.json(contact);
};

const add = async (req, res) => {
  const { body } = req;
  const newContact = await contacts.addContact(body);
  res.status(201).json(newContact);
};

const remove = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await contacts.removeContact(contactId);
  if (!deletedContact) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const { body } = req;

  if (JSON.stringify(body) === "{}") {
    throw HttpError(400, "Missing fields");
  }

  const updatedContact = await contacts.updateContact(contactId, body);

  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }
  res.json(updatedContact);
};

module.exports = {
  getAll: cntrlWrapper(getAll),
  getById: cntrlWrapper(getById),
  add: cntrlWrapper(add),
  remove: cntrlWrapper(remove),
  updateById: cntrlWrapper(updateById),
};
