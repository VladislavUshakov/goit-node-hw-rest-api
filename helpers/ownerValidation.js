const HttpError = require("./HttpError");

const modelOwnerValidation = async (user, model, id) => {
  const entity = await model.findById(id);

  if (!entity) {
    throw HttpError(404);
  }

  const ownerId = entity.owner._id.toString();
  const userId = user._id.toString();
  if (userId !== ownerId) {
    throw HttpError(403);
  }
};

module.exports = modelOwnerValidation;
