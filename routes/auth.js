var passport = require("passport");
var AsgardeoStrategy = require("passport-asgardeo");

passport.use(
  new AsgardeoStrategy(
    {
      issuer: "https://" + process.env.ASGARDEO_DOMAIN + "/oauth2/token",
      authorizationURL:
        "https://" + process.env.ASGARDEO_DOMAIN + "/oauth2/authorize",
      tokenURL: "https://" + process.env.ASGARDEO_DOMAIN + "/oauth2/token",
      userInfoURL:
        "https://" + process.env.ASGARDEO_DOMAIN + "/oauth2/userinfo",
      clientID: process.env.ASGARDEO_CLIENT_ID,
      clientSecret: process.env.ASGARDEO_CLIENT_SECRET,
      callbackURL: "/oauth2/redirect",
      scope: ["profile"],
    },
    function verify(issuer, profile, cb) {
      console.log("\nIssuer: " + issuer);
      console.log("\nProfile: " + JSON.stringify(profile));
      console.log("\ncb: " + cb);

      return cb(null, profile);
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, name: user.displayName });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

var express = require("express");
var qs = require("querystring");
var router = express.Router();

router.get("/login", passport.authenticate("asgardeo"));

router.get(
  "/oauth2/redirect",
  passport.authenticate("asgardeo", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    var params = {
      post_logout_redirect_uri: "http://localhost:3000/",
    };
    res.redirect(
      "https://" +
        process.env.ASGARDEO_DOMAIN +
        "/oidc/logout?" +
        qs.stringify(params)
    );
  });
});

module.exports = router;
