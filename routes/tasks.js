var express = require('express');
var router = express.Router();
var path = require('path');
var inspect = require('eyes').inspector({maxLength: false});
const fs = require('fs');
let xml2js = require('xml2js');
const http = require('http');
var Request = require("request");
var inspect = require('eyes').inspector({maxLength: false});

let tasks;

Request.get("http://demo2.z-bit.ee/todo.json", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    tasks = JSON.parse(body);
    // inspect(tasks);
});




router.get('/', function(req, res, next) {
  res.render('tasks', 
    {page:'Home', 
    menuId:'home',
    tasks : tasks});
});


module.exports = router;