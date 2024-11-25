var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.render("index", { user: req.user });
  } else {
    return res.render("home");
  }
});

module.exports = router;
