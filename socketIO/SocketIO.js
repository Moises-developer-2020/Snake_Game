const SocketIO=require('socket.io');
let vB = require('./sharedState')
const buffer=require('buffer');

const game = require('./game')

const webSocketServer={}


webSocketServer.init=(server)=>{
    //start socket IO
    const io=SocketIO(server);

    //newConnection
    io.on('connection',(socket)=>{

        console.log('new connection',socket.id);
        // save new user connected        
        savedUser(socket);
        
        // game function
        game(socket)

        // discconect event
        socket.on('disconnect', () => {
            console.log('Usuario desconectado:', socket.id);

        });
   });

}
// get name new user
function savedUser(socket){
    socket.on('saveUser',(user, callback)=>{
        
        // validate that seesion only work in the original dispositive that was create
        let session=buffer.Buffer.from(user.dispositive+'@'+new Date, 'binary').toString('base64');

        let newUser={
            name:user.name,
            id:socket.id,
            session:session
        }
        // save new user on server
        vB.connectedUsers.push(newUser)

        console.log(vB.connectedUsers);
        // send new user to be save on frontend
        callback({
            user:newUser.name,
            session:session
        })
        
    })
}

function deleteSession(socket){
    
}
module.exports=webSocketServer;