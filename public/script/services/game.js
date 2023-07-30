function sendMove(move){
    // get index of this player
    const user = JSON.parse(checkAndReturn('user'));
    socket.emit('move-direction',{direction:move,index:user.index});
}

socket.on('move-direction-answer',(resp)=>{
    controlarMove(resp.direction, resp.index);
})