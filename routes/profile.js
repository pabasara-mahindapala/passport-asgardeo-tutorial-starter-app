var express = require("express");
var ensureLogIn = require("connect-ensure-login").ensureLoggedIn;
var router = express.Router();

var ensureLoggedIn = ensureLogIn();

router.get("/profile", ensureLoggedIn, function (req, res, next) {
  return res.render("profile", { user: req.user });
});

module.exports = router;
