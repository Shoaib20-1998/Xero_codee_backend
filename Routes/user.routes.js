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


let a;
//GoogleAuth
Routes.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));
 
Routes.get('/getgoogleusername', (req, res) => {
    Client.GET('user', (err, value) => {
        res.send(value)      
   })  
})


Routes.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: 'https://xerocodee-mauve.vercel.app/dashboard',
        failureRedirect: 'https://xerocodee-mauve.vercel.app/login'
    }));





//GithubAuth

Routes.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }));



Routes.get('/getgithubusername', (req, res) => {
    Client.GET('gituser', (err, value) => {
        res.send(value)
    })
})
Routes.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: 'https://xerocodee-mauve.vercel.app/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('https://xerocodee-mauve.vercel.app/dashboard');
    });




Routes.get('/logout', SessionDestroy)
Routes.get('/Allusers', passport.authenticate('local', { session: false }), ReadAllUsers);

module.exports = {
    Routes
}
