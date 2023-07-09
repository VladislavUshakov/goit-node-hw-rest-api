const { HttpError, cntrlWrapper } = require("../helpers");
const { User } = require("../models/user");

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

module.exports = {
  updateSubscription: cntrlWrapper(updateSubscription),
};
