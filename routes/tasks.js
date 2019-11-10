var express = require('express');
var router = express.Router();
const axios = require('axios')
var path = require('path');
var colors = require('colors');
var bodyParser = require("body-parser");
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

router.get('/log-in', function (req, res, next) {
    errorMsg = '';
    res.render('log-in', {
        page: 'Login',
        menuId: 'log-in',
        errorMsg: errorMsg
    });
});

router.post('/log-in', logBody, getUser);

router.post('/makeTask', logBody, makeTask);

function makeTask(req, res, next){
    res.redirect('/tasks');
}

function getUser(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    let data;

    console.log();
    console.log("Session: ".yellow);
    inspect(req.session.cookie);

    axios.post('http://demo2.z-bit.ee/users/get-token', {
        username: email,
        password: password
    })
        .then((res2) => {
            console.log("Data1:".red);
            data = res2.data;
            inspect(data);
            console.log('logged in'.green)
            if (data.id != 'undefined') {
                req.session.user = res2.data;
                res.redirect('../tasks');
            }
        })
        .catch((error) => {
            inspect(error);
            errorMsg = 'Incorrect password or username';
            console.log(errorMsg.red);
            // res.send(errorMsg)
            // router.res('/log.in', (req, res) =>{
            res.render('log-in', {
                page: 'Login',
                menuId: 'log-in',
                errorMsg: errorMsg
            });
        })
    // res.end();
};

function logBody(req, res, next) {
    console.log('req.body: ')
    inspect(req.body);
    console.log();
    next();
}

router.get('/', function (req, res, next) {
    console.log("Current session:".yellow);
    inspect(req.session.user)
    if (typeof req.session.user !== 'undefined') {
        axios.get('http://demo2.z-bit.ee/tasks', {
            headers: {
                'Authorization': 'Bearer ' + req.session.user.access_token
            }
        }
        )
            .then(function (response) {
                console.log("Got tasks from API: ".green);
                inspect(response.data);
                tasks = response.data;
                res.render('tasks', {
                    page: 'Tasks',
                    menuId: 'home',
                    login: req.session.user,
                    tasks: tasks
                });
            })
            .catch(function (error) {
                console.log(error);
                console.log("Failed to get tasks from the API".red);
            });


    }
    else {
        res.render('tasksLogIn', {
            page: 'tasksLogIn',
            menuId: 'home',
            login: req.session.user
        });
    }
    console.log();
});


module.exports = router;

// axios.post('http://demo2.z-bit.ee/tasks', {
//         title: "Task 23",
//         desc: "Oi oi oi oi"
//     },
//     {
//         headers: {
//             'Authorization': 'Bearer ' + 'IAlcKXYmAhoU_ZJQlzRhuHkrabAV-brA'
//         }
//     })
//     .then((res) => {
//         console.log(`statusCode: ${res.statusCode}`)
//         console.log(res)
//     })
//     .catch((error) => {
//         console.error(error)
//     });
