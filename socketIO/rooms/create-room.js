let {connectedUsers, rooms} = require('../helpers/sharedState')
const {validateUser, getUserData, random, getRoomData, validateUserInRoom, updateUserRoom} = require('../helpers/helpers')


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
                    id:getUserData(socket.id).id,
                    index:0,
                    ready:false
                }]
              }
            rooms.push(newRoom)
            
            // join user who create it to the room
            socket.join(newRoom.id);
            
            // add room to his data
            updateUserRoom(socket.id, newRoom.id)

            // answer to the user who created the room
            socket.emit("userInThisRoom",newRoom);
            
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

        // add room to his data
        updateUserRoom(socket.id, roomID)

        // subscribe the user to the room if not exist
        if(validateUserInRoom(roomID, socket.id) == false){
            room.usersIn.push({ name: getUserData(socket.id).name, id: socket.id,index: room.usersIn.length, ready:false});
        }        

        // answer to all user connected to this room
        io.to(roomID).emit("userInThisRoom",getRoomData(roomID));

        // update room's data on client-side to all users looking its info
        io.emit('room-info-answer',getRoomData(roomID));


        callback({ status: true, message: 'ok' });
        //console.log(room.usersIn);
    });

    socket.on('Im-ready-to-play',()=>{
        const user = getUserData(socket.id);
        const room = getRoomData(user.room);

        let allUserReady=false;
        let count=0;
        for (let i = 0; i < room.usersIn.length; i++) {
            if(room.usersIn[i].id == socket.id){
                room.usersIn[i].ready = true;
            }
            if(room.usersIn[i].ready){
                count++;
            }
            if(count == room.maxUsers){
                allUserReady = true;
            }
        }
        if(allUserReady){
            io.to(user.room).emit("start-the-game",room);
        }else{
            io.to(user.room).emit("Im-ready-to-play-answer",room.usersIn);

        }
    })

}

module.exports=createRooms; 