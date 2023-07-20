const express = require("express");
const router = express.Router();

const { authentication, bodyValidation, upload } = require("../../middleware");
const { schemas } = require("../../models/user");
const cntrl = require("../../controllers/users");

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

router.delete("/", authentication, cntrl.remove);

router.get("/verify/:verificationToken", cntrl.verifyByToken);

router.post(
  "/verify",
  bodyValidation(schemas.verifySchema),
  cntrl.verifyByEmail
);

module.exports = router;
