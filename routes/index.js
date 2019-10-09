var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs');
let parseString = require('xml2js').parseString;

var cfgpath = path.join(__dirname, '..', 'cfg.json');
let rawdata = JSON.parse(fs.readFileSync(cfgpath, 'utf8'));
let xmlPath = path.join(__dirname, '..', rawdata.xml);
let xml = fs.readFileSync(xmlPath);

parseString(xml, function (err, result) {
    xmlJs = result;
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {page:'Home', menuId:'home', xmlJs : xmlJs});
});

router.get('/xml', (req, res) => {
  res.send(xmlJs);
})

module.exports = router, xmlJs;
