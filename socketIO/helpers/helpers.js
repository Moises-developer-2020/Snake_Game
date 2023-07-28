let {connectedUsers} = require('./sharedState')

const serverData = {
    // validate users session
    validateUser:function(socketID){
        if(this.findUser(socketID) !== false){
            return true;
        }
        return false;
    },
    // search user in the array
    findUser: function(socketID){
        let index = connectedUsers.findIndex((user) =>{
            return user.id == socketID || user.session == socketID
        });

        if(index != -1) {return index};
        return false;
    }
};

module.exports = serverData;