const express = require('express')
const { Routes } = require('./Routes/user.routes')
require('dotenv').config()
const cors = require("cors");
require('./Controllers/Passport-config');
require('./Controllers/GooglePassport')
const passport= require('passport')
const cookieSession=require('cookie-session')
const session = require('express-session')
const app=express()
app.use(cors());
app.use(express.json())

app.use(session({ secret: 'cats'}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/',Routes)
// app.get('/',(req,res)=>{
//     res.send('<a href="/auth/google">Auth with google</a>')
// })

// app.get('/login',(req,res)=>{
//     res.send('<a href="https://github.com/login/oauth/authorize?client_id=805124a881ee240807c0&scope=repo">Auth with Git</a>')
// })
app.listen(process.env.port,async()=>{
    try {
        console.log("server is running")
    } catch (error) {
        console.log(error)
    } 
})

