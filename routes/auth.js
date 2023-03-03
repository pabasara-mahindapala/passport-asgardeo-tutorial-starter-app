var passport = require('passport');
var AsgardeoStrategy = require('passport-asgardeo');

passport.use(new AsgardeoStrategy({
  issuer: 'https://' + process.env['AUTH0_DOMAIN'] + '/oauth2/token',
  authorizationURL: 'https://' + process.env['AUTH0_DOMAIN'] + '/oauth2/authorize',
  tokenURL: 'https://' + process.env['AUTH0_DOMAIN'] + '/oauth2/token',
  userInfoURL: 'https://' + process.env['AUTH0_DOMAIN'] + '/oauth2/userinfo',
  clientID: process.env['AUTH0_CLIENT_ID'],
  clientSecret: process.env['AUTH0_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect',
  scope: [ 'profile' ]
}, function verify(issuer, profile, cb) {
  return cb(null, profile)}));


var express = require('express');

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.displayName });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

var qs = require('querystring');
var router = express.Router();

router.get('/login', passport.authenticate('asgardeo'));

router.get('/oauth2/redirect', passport.authenticate('asgardeo', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    var params = {
      client_id: process.env['AUTH0_CLIENT_ID'],
      returnTo: 'http://localhost:3000/'
    };
    res.redirect('https://' + process.env['AUTH0_DOMAIN'] + '/oidc/logout?' + qs.stringify(params));
  });
});

module.exports = router;