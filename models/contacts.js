const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "contacts.json");

async function listContacts() {
  const buffer = await fs.readFile(contactsPath);
  return JSON.parse(buffer);
}

async function getContactById(contactId) {
  const contactsList = await listContacts();
  return contactsList.find((contact) => contact.id === contactId) || null;
}

async function removeContact(contactId) {
  const contactsList = await listContacts();
  const index = contactsList.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const [removedContact] = contactsList.splice(index, 1);
  fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
  return removedContact;
}

const addContact = async ({ name, email, phone }) => {
  const contactsList = await listContacts();
  const newContact = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
  };

  contactsList.push(newContact);
  fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contactsList = await listContacts();
  const index = contactsList.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  contactsList[index] = { ...contactsList[index], ...body };
  fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
  return contactsList[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
