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

router.get('/logOut', logOut);

router.post('/log-in', logBody, getUser);

router.post('/register', logBody, registerUser);

router.post('/makeTask', logBody, makeTask);

router.post('/edit', logBody, editTask);

router.get('/register', function (req, res) {
    res.render('register', {
        page: 'Register',
        menuId: 'Register',
        errorMsg: errorMsg
    });
});

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

function registerUser(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
    let firstname = req.body.firstname;
    let lastName = req.body.lastName;


    axios.post('http://demo2.z-bit.ee/users', {
        username: email,
        firstname: firstname,
        lastName: lastName,
        newPassword: password
    })
        .then((res2) => {
            console.log("Data1:".red);
            data = res2.data;
            inspect(data);
            console.log('logged in'.green)
            if (typeof data.id != 'undefined') {
                req.session.user = res2.data;
                res.redirect('../tasks');
            }
        })
        .catch((error) => {
            inspect(error);
            errorMsg = 'Something went wrong, try again';
            console.log(errorMsg.red);
            // res.send(errorMsg)
            // router.res('/log.in', (req, res) =>{
            res.render('Register', {
                page: 'Login',
                menuId: 'log-in',
                errorMsg: errorMsg
            });
        })
}

function logOut(req, res, next) {

    console.log("Logging out".green);
    req.session.destroy();

    res.redirect('/tasks');
}

function editTask(req, res, next) {
    let editData = {
        'id': req.body.id,
        'action': req.body.action,
        'title': req.body.title
    }

    console.log(editData.action);

    if (editData.action == "Delete") {
        console.log("Deleting task".red);
        axios.delete('http://demo2.z-bit.ee/tasks/' + editData.id, {
            headers: {
                'Authorization': 'Bearer ' + req.session.user.access_token
            }
        })
            .then(function (response) {
                res.redirect('/tasks');
            })
            .catch(function (error) {
                console.log(error);
                console.log("Failed to delete task on the API".red);
                res.redirect('error');
            });
    }
    else {
        let data = {
            "title": editData.title,
            "marked_as_done": true
        }
        if (editData.action == "Mark as In Progress") {
            data.marked_as_done = false;
        }

        axios.put('http://demo2.z-bit.ee/tasks/' + editData.id, data, {
            headers: {
                'Authorization': 'Bearer ' + req.session.user.access_token
            }
        })
            .then(function (response) {
                res.redirect('/tasks');
            })
            .catch(function (error) {
                console.log(error);
                console.log("Failed update task on the API".red);
            });
    }


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
        .then(function (response) {
            res.redirect('/tasks');
        })
        .catch(function (error) {
            console.log(error);
            console.log("Failed to push tasks to the API".red);
            res.render('tasks', {
                page: 'Tasks',
                menuId: 'home',
                login: req.session.user,
                tasks: tasks,
                ErrorMsg: "Failed the task creation"
            });
        });
}

function getUser(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

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
            if (typeof data.id != 'undefined') {
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


module.exports = router;