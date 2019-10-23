var express = require('express');
var router = express.Router();
var path = require('path');
var inspect = require('eyes').inspector({maxLength: false});
const fs = require('fs');
let xml2js = require('xml2js');


/* GET home page. */
router.get('/cookies', function(req, res, next) {
  res.render('stealYaCookies', 
    {page:'Home'});
});

module.exports = router;