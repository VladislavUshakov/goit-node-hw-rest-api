const fs = require("node:fs/promises");
const puth = require("node:path");
const jimp = require("jimp");

const { HttpError, cntrlWrapper } = require("../helpers");
const { User } = require("../models/user");

const avatarsDir = puth.join(__dirname, "../", "public", "avatars");

const remove = async (req, res) => {
  const { _id: id } = req.user;
  const removedUser = await User.findByIdAndRemove(id);

  if (!removedUser) {
    throw HttpError(404);
  }

  res.json({ message: "user deleted" });
};

const updateSubscription = async (req, res) => {
  const { _id: id } = req.user;
  const { subscription } = req.body;

  const user = await User.findById(id);
  if (user.subscription === subscription) {
    throw HttpError(409, "Current and new subscriptions are the same");
  }
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { subscription },
    {
      new: true,
      select: "-createdAt -updatedAt",
    }
  );

  res.json(updatedUser);
};

const updateAvatar = async (req, res) => {
  const { path: tempUpload, filename } = req.file;
  const { _id: id } = req.user;

  const resultUpload = puth.join(avatarsDir, filename);
  const avatarURL = puth.join("avatars", filename);

  const avatarImg = await jimp.read(tempUpload);
  await avatarImg.resize(250, 250);
  await avatarImg.writeAsync(tempUpload);

  await fs.rename(tempUpload, resultUpload);
  await User.findByIdAndUpdate(id, { avatarURL }, { new: true });

  res.json({ avatarURL });
};

module.exports = {
  updateSubscription: cntrlWrapper(updateSubscription),
  updateAvatar: cntrlWrapper(updateAvatar),
  remove: cntrlWrapper(remove),
};
