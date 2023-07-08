const express = require("express");
const router = express.Router();

const cntrl = require("../../controllers/auth");
const { bodyValidation, authentication } = require("../../middleware");
const { schemas } = require("../../models/user");

router.post(
  "/register",
  bodyValidation(schemas.registerSchema),
  cntrl.register
);

router.post("/login", bodyValidation(schemas.loginSchema), cntrl.login);

router.post("/logout", authentication, cntrl.logout);

router.get("/current", authentication, cntrl.getUser);

module.exports = router;
