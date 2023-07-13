const express = require("express");
const router = express.Router();

const { authentication, bodyValidation, upload } = require("../../middleware");
const { schemas } = require("../../models/user");
const cntrl = require("../../controllers/users");

router.delete("/", authentication, cntrl.remove);

router.patch(
  "/subscription",
  authentication,
  bodyValidation(schemas.subscriptionSchema),
  cntrl.updateSubscription
);

router.patch(
  "/avatars",
  authentication,
  upload.single("avatar"),
  cntrl.updateAvatar
);

module.exports = router;
