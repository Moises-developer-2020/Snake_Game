let {connectedUsers, rooms} = require('./sharedState')

const helpers = {};

// validate users session
helpers.validateUser = (socketID)=>{
    if(helpers.findUser(socketID) !== false){
        return true;
    }
    return false;
},

// search user in the array
helpers.findUser=(socketID)=>{
    let index = connectedUsers.findIndex((user) =>{
        return user.id == socketID || user.session == socketID
    });

    if(index != -1) {return index};
    return false;
}

helpers.getUserData =(socketID)=>{
    if(helpers.validateUser(socketID)){
        const user = connectedUsers[helpers.findUser(socketID)];
        return {
            name:user.name,
            id: user.id,
            session: user.session
        }
    }   
    return {
        status: false
    }
}

helpers.getRoomData =(roomID)=>{
    const index = rooms.findIndex((element)=>{
        return element.id == roomID
    })
    if(index != -1){
        return rooms[index]
    }
    return false
}

helpers.validateUserInRoom =(roomID, userId)=>{
    const room = rooms.find((r) => r.id === roomID);
    const index = room.usersIn.findIndex((element)=>{
        return element.id == userId
    })
    if(index != -1){
        return true
    }
    return false
}
// sort number
helpers.random = (rangoInicial, rangoFinal)=>{
    return Math.floor(Math.random() * (rangoFinal - rangoInicial + 1) + rangoInicial);
}

module.exports = helpers;