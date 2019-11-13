var express = require('express');
var router = express.Router();
const axios = require('axios').default;
var path = require('path');
var colors = require('colors');
var bodyParser = require("body-parser");
const fs = require('fs');
let xml2js = require('xml2js');
const http = require('http');
var Request = require("request");
const {
    check,
    validationResult
} = require('express-validator');
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

router.post('/logOut', logBody, logOut);

router.post('/log-in', logBody, getUser);

router.post('/makeTask', logBody, makeTask);

router.post('/edit', logBody, editTask);

function logOut(req, res, next) {

    console.log("Logging out".green);
    res.session.destroy();

    res.redirect('/log-in');
}

function editTask(req, res, next) {
    let editData = {
        'id': req.body.id,
        'action': req.body.action,
        'title': req.body.title
    }

    console.log(editData.action);

    if(editData.action == "Delete"){
        console.log("Deleting task".red);
        axios.delete('http://demo2.z-bit.ee/tasks/' + editData.id, {
            headers: {
                'Authorization': 'Bearer ' + req.session.user.access_token
            }
        })
        .catch(function (error) {
            console.log(error);
            console.log("Failed to delete task on the API".red);
        });
    }
    else{
        let data = {
            "title": editData.title,
            "marked_as_done": true
        }
        if(editData.action == "Mark as In Progress"){
            data.marked_as_done = false;
        }

        axios.put('http://demo2.z-bit.ee/tasks/' + editData.id, data, {
            headers: {
                'Authorization': 'Bearer ' + req.session.user.access_token
            }
        })
        .catch(function (error) {
            console.log(error);
            console.log("Failed update task on the API".red);
        });
    }

    
    res.redirect('/tasks');
}

function makeTask(req, res, next) {
    let taskData = {
        'title': req.body.Title,
        'desc': req.body.Desc
    }

    axios.post('http://demo2.z-bit.ee/tasks', taskData, {
        headers: {
            'Authorization': 'Bearer ' + req.session.user.access_token
        }
    })
    .then(function(response){
    })
    .catch(function (error) {
        console.log(error);
        console.log("Failed to push tasks to the API".red);
    });

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
            })
            .then(function (response) {
                console.log("Got tasks from API ".green);
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


    } else {
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