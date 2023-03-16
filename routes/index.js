var express = require('express');
var db = require('../db');

var router = express.Router();


router.get('/', function(req, res, next) {
  if (req.user) {
  res.render('index', { user: req.user });
  console.log(req.user);
  }
  else{
    return res.render('home');
    }
  }
);

module.exports = router;
