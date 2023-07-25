const express= require('express');
const socket = require('./SocketIO')
const app=express();

const path =require('path');

//setting
app.set('port',process.env.PORT || 3000);

//public
app.use(express.static(path.join(__dirname,'public')));

//start server 
const server=app.listen(app.get('port'),()=>{
    console.log('Server on port ',app.get('port'));
    
});
//init socketIO
socket.init(server);




