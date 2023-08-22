const express = require('express')
const { SignupUser, LoginUser,GithubAuth, ReadAllUsers, AuthSuccess, AuthFail, SessionDestroy } = require('../Controllers/user.controller')
require('dotenv').config()
const passport = require('passport')
const isLoggedin = require('../Middleware/isLogged')
require('../Controllers/GooglePassport')
const Routes = express.Router()
//loginSingup
Routes.post('/signup', SignupUser)
Routes.post('/signin', LoginUser)

//GoogleAuth
Routes.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));
Routes.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

//GithubAuth
Routes.get('/auth/github/callback',GithubAuth)


Routes.get('/auth/google/success',isLoggedin, AuthSuccess)
Routes.get('/auth/google/failure', AuthFail)
Routes.get('/logout',SessionDestroy)
Routes.get('/Allusers', passport.authenticate('local', { session: false }), ReadAllUsers);

module.exports = {
    Routes
}
