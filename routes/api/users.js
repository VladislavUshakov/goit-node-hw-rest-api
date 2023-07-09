const express = require("express");
const router = express.Router();

const { authentication, bodyValidation } = require("../../middleware");
const { schemas } = require("../../models/user");
const cntrl = require("../../controllers/users");

router.patch(
  "/subscription",
  authentication,
  bodyValidation(schemas.subscriptionSchema),
  cntrl.updateSubscription
);

module.exports = router;
