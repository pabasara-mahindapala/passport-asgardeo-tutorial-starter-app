var express = require("express");
var ensureLogIn = require("connect-ensure-login").ensureLoggedIn;
var router = express.Router();

var ensureLoggedIn = ensureLogIn();

router.get("/protected", ensureLoggedIn, function (req, res, next) {
  return res.render("protected");
});

module.exports = router;
