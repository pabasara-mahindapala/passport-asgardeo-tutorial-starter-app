var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  // console.log("\nRequest: " + JSON.stringify(req));
  // console.log("Response: " + JSON.stringify(res));
  if (req.user) {
    res.render("index", { user: req.user });
    console.log("\nUser: " + JSON.stringify(req.user));
  } else {
    return res.render("home");
  }
});

module.exports = router;
