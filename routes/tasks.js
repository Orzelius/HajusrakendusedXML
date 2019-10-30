var express = require('express');
var router = express.Router();
const axios = require('axios')
var path = require('path');
var bodyParser = require("body-parser");
var inspect = require('eyes').inspector({
    maxLength: false
});
const fs = require('fs');
let xml2js = require('xml2js');
const http = require('http');
var Request = require("request");
const { check, validationResult } = require('express-validator');
var inspect = require('eyes').inspector({
    maxLength: false
});

let tasks;

Request.get("http://demo2.z-bit.ee/todo.json", (error, response, body) => {
    if (error) {
        return console.dir(error);
    }
    tasks = JSON.parse(body);
    // inspect(tasks);
});

router.get('/log-in', function (req, res, next) {
    res.render('log-in', {
        page: 'Login',
        menuId: 'log-in',
        tasks: tasks
    });
});

router.post('/log-in',function(req,res){
    console.log('req.body: ')
    inspect(req.body);
    console.log();
    var email=req.body.email;
    var password=req.body.password;

    axios.post('http://demo2.z-bit.ee/users/get-token', {
        username: email,
        password: password
    })
    .then((res) => {
        inspect(`statusCode: ${res.statusCode}`);
        inspect(res.data);
    })
    .catch((error) => {
        inspect(error);
})

    res.end();
});

// router.post('/log-in', 
// [
//     // username must be an email
//     check('email').isEmail(),
//     // password must be at least 5 chars long
//     check('password').isLength({ min: 5 })
// ], 
// (req, res) => {;
//     // Finds the validation errors in this request and wraps them in an object with handy functions
//     const errors = validationResult(res);
//     if (!errors.isEmpty()) {
//         return res.status(422).json({ errors: errors.array() });
//     }

//     User.create({
//         username: req.body.username,
//         password: req.body.password
//     }).then(user => res.json(user));
// });

// axios.post('http://demo2.z-bit.ee/users', {
//         username: "Albert",
//         firstname: "Albert",
//         lastname: "Kostusev",
//         newPassword: "abc123!"
//     })
//     .then((res) => {
//         console.log(`statusCode: ${res.statusCode}`)
//         console.log(res)
//     })
//     .catch((error) => {
//         console.error(error)
// })

router.get('/', function (req, res, next) {
    res.render('tasks', {
        page: 'Tasks',
        menuId: 'home',
        tasks: tasks
    });
});


module.exports = router;