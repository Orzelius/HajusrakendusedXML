var express = require('express');
var router = express.Router();
var path = require('path');
var inspect = require('eyes').inspector({maxLength: false});
const fs = require('fs');
let xml2js = require('xml2js');

var cfgpath = path.join(__dirname, '..', 'cfg.json');
//reads the cfg file for data
let rawdata = JSON.parse(fs.readFileSync(cfgpath, 'utf8'));
let xmlPath = path.join(__dirname, '..', rawdata.xml);

let xml = fs.readFileSync(xmlPath);
let xmlJs;

var parser = new xml2js.Parser(/* options */);
parser.parseStringPromise(xml).then(function (result) {
  xmlJs = result;
  // inspect(result.menu.item);
  console.log('Done');
})
.catch(function (err) {
  // Failed
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', 
    {page:'Home', 
    menuId:'home', 
    xmlJsClass : xmlJs.menu.item});
});

router.get('/xml', (req, res) => {
  res.send(xmlJs);
})

// router.get('/cookies', function(req, res, next) {
//   res.render('stealYaCookies', 
//     {page:'Home', 
//     menuId:'home'});
// });

module.exports = router, xmlJs;