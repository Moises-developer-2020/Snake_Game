let {connectedUsers, rooms} = require('../helpers/sharedState')
const {validateUser, getUserData, random, getRoomData, validateUserInRoom} = require('../helpers/helpers')


let createRooms =()=>{}

createRooms=(socket, io)=>{
    socket.on('create-room',(data, callback)=>{
        // validate session
        if(validateUser(socket.id)){
            const newRoom={
                id:'R'+rooms.length+1,
                key:random(11111,99999),
                nameRoom:data.roomName,
                amounSats:data.amountSats,
                maxUsers:data.maxUser,
                limitTime:data.limitTime,
                private:data.private,
                createdBy:getUserData(socket.id).name,
                usersIn:[{
                    name:getUserData(socket.id).name,
                    id:getUserData(socket.id).id
                }]
              }
            rooms.push(newRoom)

            //sent answer to all users
            io.emit('create-room-answer',newRoom)
            
            // sent to say session it is ok
            callback({
                status:true
            })
            return
        }

        callback({
            status:false
        })
        
    });
    // get room's info
    socket.on('room-info',(data, callback)=>{
        if(validateUser(socket.id)){
            // answer only the sender
            socket.emit('room-info-answer',getRoomData(data));

            callback({
                status:true
            })
            return
        }
        callback({
            status:false
        })
    })

    socket.on('join-room', (roomID, callback) => {
        // ckeck if exist room
        const room = rooms.find((r) => r.id === roomID);
        if (!room) {
          callback({ status: false, message: 'Room not founded' });
          return;
        }
        if (room.usersIn.length >= room.maxUsers) {
          callback({ status: false, message: 'The room it`s full' });
          return;
        }
    
        // if all it is ok
        socket.join(roomID);

        // subscribe the user to the room if not exist
        if(validateUserInRoom(roomID, socket.id) == false){
            room.usersIn.push({ name: getUserData(socket.id).name, id: socket.id });
        }        
        // update room's data on client-side to all users looking its info
        io.emit('room-info-answer',getRoomData(roomID));

        callback({ status: true, message: 'ok' });
        console.log(rooms);
      });

}

module.exports=createRooms; 