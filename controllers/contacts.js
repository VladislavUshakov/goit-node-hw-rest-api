const { Contact } = require("../models/contact");
const { HttpError, cntrlWrapper, modelOwnerValidation } = require("../helpers");

const getAll = async (req, res) => {
  const { page = 1, limit = 10, favorite } = req.query;
  const { _id: owner } = req.user;
  const skip = (page - 1) * limit;

  const filters = {
    owner,
  };

  if (favorite) {
    filters.favorite = favorite;
  }

  const contactsList = await Contact.find(filters, "", {
    skip,
    limit,
  }).populate("owner", "email subscription");

  res.json(contactsList);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const { user } = req;
  await modelOwnerValidation(user, Contact, contactId);

  const contact = await Contact.findById(contactId, "-createdAt -updatedAt");
  res.json(contact);
};

const add = async (req, res) => {
  const { body, user } = req;
  const newContact = await Contact.create({ ...body, owner: user._id });
  res.status(201).json(newContact);
};

const remove = async (req, res) => {
  const { contactId } = req.params;
  const { user } = req;
  await modelOwnerValidation(user, Contact, contactId);

  await Contact.findByIdAndRemove(contactId);
  res.json({ message: "contact deleted" });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const { body, user } = req;

  if (JSON.stringify(body) === "{}") {
    throw HttpError(400, "Missing fields");
  }
  await modelOwnerValidation(user, Contact, contactId);

  const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { user } = req;

  if (favorite === undefined) {
    throw HttpError(400, "Missing field favorite");
  }

  await modelOwnerValidation(user, Contact, contactId);

  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    {
      new: true,
    }
  );
  res.json(updatedContact);
};

module.exports = {
  getAll: cntrlWrapper(getAll),
  getById: cntrlWrapper(getById),
  add: cntrlWrapper(add),
  remove: cntrlWrapper(remove),
  updateById: cntrlWrapper(updateById),
  updateStatusContact: cntrlWrapper(updateStatusContact),
};
