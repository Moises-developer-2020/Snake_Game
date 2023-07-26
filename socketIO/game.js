const vB = require('./sharedState')
let game =()=>{}

game=(socket)=>{
    socket.on('create-room',(arg)=>{
        console.log(arg);
        
    })

}

module.exports=game;