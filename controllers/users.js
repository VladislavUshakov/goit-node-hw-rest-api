const fs = require("fs/promises");
const path = require("path");
const jimp = require("jimp");

const { HttpError, cntrlWrapper, sendEmail } = require("../helpers");
const { User } = require("../models/user");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

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

  const resultUpload = path.join(avatarsDir, filename);
  const avatarURL = path.join("avatars", filename);

  const avatarImg = await jimp.read(tempUpload);
  await avatarImg.resize(250, 250);
  await avatarImg.writeAsync(tempUpload);

  await fs.rename(tempUpload, resultUpload);
  await User.findByIdAndUpdate(id, { avatarURL }, { new: true });

  res.json({ avatarURL });
};

const verifyByToken = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOneAndUpdate(
    { verificationToken },
    { verificationToken: null, verify: true }
  );

  if (!user) {
    throw HttpError(404, "User not found");
  }

  res.json({
    message: "Verification successful",
  });
};

const verifyByEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const emailOptions = {
    to: email,
    subject: "Verification letter",
    html: `
      <a href=http://localhost:3000/api/users/verify/${user.verificationToken} target=”_blank”>Verification link</a>
    `,
  };

  await sendEmail(emailOptions);

  res.json({
    message: "Verification email sent",
  });
};

module.exports = {
  updateSubscription: cntrlWrapper(updateSubscription),
  updateAvatar: cntrlWrapper(updateAvatar),
  remove: cntrlWrapper(remove),
  verifyByToken: cntrlWrapper(verifyByToken),
  verifyByEmail: cntrlWrapper(verifyByEmail),
};
