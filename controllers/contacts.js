const { Contact } = require("../models/contact");
const { HttpError, cntrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { page = 1, limit = 10, favorite } = req.query;
  const { _id: owner } = req.user;
  const skip = (page - 1) * limit;

  const contactsList = favorite
    ? await Contact.find({ owner, favorite }, "", {
        skip,
        limit,
      }).populate("owner", "email subscription")
    : await Contact.find({ owner }, "", {
        skip,
        limit,
      }).populate("owner", "email subscription");
  res.json(contactsList);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw HttpError(404);
  }

  res.json(contact);
};

const add = async (req, res) => {
  const { body, user } = req;
  const newContact = await Contact.create({ ...body, owner: user._id });
  res.status(201).json(newContact);
};

const remove = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await Contact.findByIdAndRemove(contactId);
  if (!deletedContact) {
    throw HttpError(404);
  }
  res.json({ message: "contact deleted" });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const { body } = req;

  if (JSON.stringify(body) === "{}") {
    throw HttpError(400, "Missing fields");
  }

  const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
  });

  if (!updatedContact) {
    throw HttpError(404);
  }
  res.json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  if (favorite === undefined) {
    throw HttpError(400, "Missing field favorite");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    {
      new: true,
    }
  );

  if (!updatedContact) {
    throw HttpError(404);
  }
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
