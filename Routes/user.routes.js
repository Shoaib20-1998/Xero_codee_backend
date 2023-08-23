const express = require('express')
const { SignupUser, LoginUser, ReadAllUsers, AuthSuccess, AuthFail, SessionDestroy } = require('../Controllers/user.controller')
require('dotenv').config()
const passport = require('passport')
const isLoggedin = require('../Middleware/isLogged')
const Client = require('../Controllers/Redis')
require('../Controllers/GooglePassport')
const Routes = express.Router()

//loginSingup
Routes.post('/signup', SignupUser)
Routes.post('/signin', LoginUser)



//GoogleAuth
Routes.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

Routes.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: 'http://localhost:3000/dashboard',
        failureRedirect: 'http://localhost:3000/login'
    }));

Routes.get('/getgoogleusername', (req, res) => {
    Client.GET('user', (err, value) => {
        res.send(value)
    })
})



//GithubAuth
Routes.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }));


Routes.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: 'http://localhost:3000/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:3000/dashboard');
    });

Routes.get('/getgithubusername', (req, res) => {
    Client.GET('gituser', (err, value) => {
        res.send(value)
    })
})


Routes.get('/logout', SessionDestroy)
Routes.get('/Allusers', passport.authenticate('local', { session: false }), ReadAllUsers);

module.exports = {
    Routes
}
