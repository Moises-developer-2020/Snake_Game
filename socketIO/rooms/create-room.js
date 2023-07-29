let {connectedUsers, rooms} = require('../helpers/sharedState')
const {validateUser, getUserData, random, getRoomData} = require('../helpers/helpers')


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
                    name:getUserData(socket.id).name
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

    socket.on('room-info',(data, callback)=>{
        if(validateUser(socket.id)){

            io.emit('room-info-answer',getRoomData(data));

            callback({
                status:true
            })
            return
        }
        callback({
            status:false
        })
    })

}

module.exports=createRooms; 