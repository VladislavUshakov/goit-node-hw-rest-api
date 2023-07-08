const { HttpError, cntrlWrapper } = require("../helpers");
const { User } = require("../models/user");

const updateSubscription = async (req, res) => {
  const { _id: id } = req.user;
  const { subscription } = req.body;
  const user = await User.findByIdAndUpdate(id, { subscription });
  if (user.subscription === subscription) {
    throw HttpError(409, "Current and new subscriptions are the same");
  }

  res.json(user);
};

module.exports = {
  updateSubscription: cntrlWrapper(updateSubscription),
};
