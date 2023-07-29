const SocketIO=require('socket.io');
// variables server-side
let {connectedUsers} = require('./helpers/sharedState')
let {findUser} = require('./helpers/helpers')

// hash string value
const buffer=require('buffer');

// game functions
const createRooms = require('./rooms/create-room')
const game = require('./game')


const webSocketServer={}


webSocketServer.init=(server)=>{
    //start socket IO
    const io=SocketIO(server);

    //newConnection
    io.on('connection',(socket)=>{
        socket.on('test',(e)=>{
            console.log(connectedUsers);
        })
        stopDisconnectionUser(socket);

        console.log('new connection',socket.id);
        // save new user connected        
        savedUser(socket);
        
        // game function
        game(socket)
        createRooms(socket, io)

        // discconect event
        socket.on('disconnect', () => {
            console.log('Usuario desconectado:', socket.id);
            deleteSession(socket)
        });
   });

}
// get new user`s data
function savedUser(socket){
    socket.on('saveUser',(user, callback)=>{
        
        // validate that seesion only work in the original dispositive that was create
        let session=buffer.Buffer.from(user.dispositive+'@'+new Date, 'binary').toString('base64');

        let newUser={
            name:user.name,
            id:socket.id,
            session:session,
            time:null,
            disconnection:function(){//time of desconection, event 'disconnect' of the socket
                console.log('disconnecting... '+this.name);
                    this.time=setTimeout(() => {
                        var ud=connectedUsers.indexOf(this.id);
                        connectedUsers.splice(ud,1)
                        console.log("15s expired: delete: ", this.name);
                    }, 15000); //15s before delete user`s connection "session"
                },
            stopDisconnection:function(newID){//stop desconnection of user
                console.log('disconnection Stopped: '+this.name);
                this.id = newID;
                clearTimeout(this.time);
            },
        }
        // save new user on server
        connectedUsers.push(newUser);

        console.log(connectedUsers);
        // send new user to be save on frontend
        callback({
            user:newUser.name,
            session:session
        })
        
    })
}

function deleteSession(socket){
    function dateInHours(dateSave) {
        // Set the date we're counting down to
        var getDateSave = new Date(dateSave).getTime();

        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now an the count down date
        var distance = now - getDateSave;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return JSON.parse(`{
            "days":${days},
            "hours":${hours},
            "minutes":${minutes},
            "seconds":${seconds}
        }`);
    };

    // let dispositive = Buffer.from(connectedUsers[0].session, 'base64').toString('utf-8').split('@')[0]
    // let sessionDate =Buffer.from(connectedUsers[0].session, 'base64').toString('utf-8').split('@')[1];
    // console.log(dateInHours(sessionDate));

    // star the countdown to disconect the user in 15s
    let userIndex =findUser(socket.id);
    if (userIndex !== false) {
        connectedUsers[userIndex].disconnection();
    }

}

function stopDisconnectionUser(socket){
    // onload event client-side
    socket.on('validate-session',(resp, callback)=>{
        let userIndex = findUser(resp.session);
        if (userIndex !== false) {
            // stop disconnection and update his new socked id
            connectedUsers[userIndex].stopDisconnection(socket.id);
            // session active yet
            callback({
                status:true  
            })
            return
        }
        // session expire
        callback({
            status:false  
        })
    });
}


module.exports=webSocketServer;