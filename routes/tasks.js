var express = require('express');
var router = express.Router();
const axios = require('axios')
var path = require('path');
var colors = require('colors');
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

var cookieParser = require('cookie-parser');
var session = require('express-session');

let errorMsg = "";
let tasks;
let login = {
    name: "",
    status: "",
    password: "",
    access_token: ""
};
let sess;

Request.get("http://demo2.z-bit.ee/todo.json", (error, response, body) => {
    if (error) {
        return console.dir(error);
    }
    tasks = JSON.parse(body);
    // inspect(tasks);
});

router.get('/log-in', function (req, res, next) {
    errorMsg = '';
    res.render('log-in', {
        page: 'Login',
        menuId: 'log-in',
        errorMsg: errorMsg
    });
});

router.post('/log-in', logBody, getUser);

function getUser(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    let data;

    axios.post('http://demo2.z-bit.ee/users/get-token', {
        username: email,
        password: password
    })
        .then((res2) => {
            inspect(`statusCode: ${res2.statusCode}`);
            inspect(res2.data);
            data = res2.data;
            console.log('logged in'.green)
        })
        .catch((error) => {
            inspect(error);
            errorMsg = 'Incorrect password or username';
            console.log(errorMsg.red);
            // res.send(errorMsg)
            // router.res('/log.in', (req, res) =>{
        })
        console.log("Data:".red)
        inspect(data);
    if (data.id != 'undefined') {
        sess = res.data;
        res.redirect('');
    }
    res.render('log-in', {
        page: 'Login',
        menuId: 'log-in',
        errorMsg: errorMsg
    });
    // res.end();
};

function logBody(req, res, next) {
    console.log('req.body: ')
    inspect(req.body);
    console.log();
    next();
}

router.get('/', function (req, res, next) {
    res.render('tasks', {
        page: 'Tasks',
        menuId: 'home',
        login: login,
        tasks: tasks
    });
    inspect(res.session);
});


module.exports = router;

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
