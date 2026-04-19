const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const userController  = require('../controller/user.js');

router
.route("/signup")
.get(userController.renderSignupForm )
.post(
  wrapAsync(userController.signup),
);
const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

router
.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl, //  MUST be before passport
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

router.get("/logout",userController.logout);

module.exports = router;
