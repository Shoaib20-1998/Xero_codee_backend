const passport = require('passport');
const Client = require('./Redis');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require('dotenv').config()

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback   : true,
  },
  function(request, accessToken, refreshToken, profile, done) {    
    Client.SET('user', profile.displayName) 
    return done( null,profile);

  }
));

passport.serializeUser((user,done)=>{
    done(null,user);
})

passport.deserializeUser((user,done)=>{
    done(null,user)
})

module.exports=passport