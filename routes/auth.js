var passport = require("passport");
var AsgardeoStrategy = require("passport-asgardeo");
const ASGARDEO_BASE_URL = "https://api.asgardeo.io/t/";

passport.use(
  new AsgardeoStrategy(
    {
      issuer:
        ASGARDEO_BASE_URL + process.env.ASGARDEO_ORGANISATION + "/oauth2/token",
      authorizationURL:
        ASGARDEO_BASE_URL +
        process.env.ASGARDEO_ORGANISATION +
        "/oauth2/authorize",
      tokenURL:
        ASGARDEO_BASE_URL + process.env.ASGARDEO_ORGANISATION + "/oauth2/token",
      userInfoURL:
        ASGARDEO_BASE_URL +
        process.env.ASGARDEO_ORGANISATION +
        "/oauth2/userinfo",
      clientID: process.env.ASGARDEO_CLIENT_ID,
      clientSecret: process.env.ASGARDEO_CLIENT_SECRET,
      callbackURL: "/oauth2/redirect",
      scope: ["profile internal_login"],
    },
    function verify(
      issuer,
      uiProfile,
      idProfile,
      context,
      idToken,
      accessToken,
      refreshToken,
      params,
      verified
    ) {
      return verified(null, {
        uiProfile: uiProfile,
        accessToken: accessToken,
      });
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, {
      id: user?.uiProfile?.id,
      username: user?.uiProfile?._json?.username,
      givenName: user?.uiProfile?.name?.givenName,
      familyName: user?.uiProfile?.name?.familyName,
      accessToken: user?.accessToken,
    });
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
      ASGARDEO_BASE_URL +
        process.env.ASGARDEO_ORGANISATION +
        "/oidc/logout?" +
        qs.stringify(params)
    );
  });
});

module.exports = router;
