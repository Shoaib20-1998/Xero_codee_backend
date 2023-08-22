const redis = require('redis');
require('dotenv').config()
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = process.env.REDIS_PORT || 6379;
const Client = redis.createClient({
    host: redisHost,
    port: redisPort        
});

Client.on('connect',()=>{
    console.log("client is connected to redis")
})

Client.on('error',(err)=>{
    console.log(err.message)
})

Client.on('ready',(err)=>{
    console.log("client is connected to redis and ready to use")

})
Client.on('end',(err)=>{
    console.log("client disconnected to redis")
})

process.on('SIGINT',()=>{
    Client.quit()
})



module.exports=Client

