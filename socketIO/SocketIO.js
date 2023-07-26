const SocketIO=require('socket.io');
let vB = require('./sharedState')

const game = require('./game')

const webSocketServer={}


webSocketServer.init=(server)=>{
    //start socket IO
    const io=SocketIO(server);

    //newConnection
    io.on('connection',(socket)=>{
        console.log('new connection',socket.id);
        // save new user connected
        vB.connectedUsers.push({user:socket.id, socket});
        
        // game function
        game(socket)

        // discconect event
        socket.on('disconnect', () => {
            console.log('Usuario desconectado:', socket.id);

        });
   });

}

module.exports=webSocketServer;