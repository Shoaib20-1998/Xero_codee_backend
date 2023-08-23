const express = require('express')
const { Routes } = require('./Routes/user.routes')
require('dotenv').config()
const cors = require("cors");
require('./Controllers/Passport-config');
require('./Controllers/GooglePassport')
require('./Controllers/GithubPassport')
const passport= require('passport')
const session = require('express-session')
const app=express()

app.use(cors({exposedHeaders: ['Access-Control-Allow-Origin'], origin: 'https://xerocodee-mauve.vercel.app', credentials: true }));
app.use(express.json())
app.set('trust proxy',1)
app.use(session({ 
    secret: 'cats',
    resave:true,
    saveUninitialized:true,
    cookie:{
        sameSite:'none',
        secure:true,
        maxAge:1000*60*60*24*7
    }
}));
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

