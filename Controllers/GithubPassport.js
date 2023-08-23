require('dotenv').config()
const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport');
const Client = require('./Redis');

console.log(process.env.Github_Client_Secret, "id", process.env.Github_Clinet_ID)
passport.use(new GitHubStrategy({
  clientID: process.env.Github_Clinet_ID,
  clientSecret: process.env.Github_Client_Secret,
  callbackURL: "/auth/github/callback"
},
  function (accessToken, refreshToken, profile, done) {
    Client.SET('gituser', profile.username)
    return done(null, profile);
    ;
  }
));

// http://localhost:8080/auth/github
passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser((user, done) => {
  done(null, user)
})