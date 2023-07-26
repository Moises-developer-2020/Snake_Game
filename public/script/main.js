//connect socket
const socket=io();
const CreateRoom = document.getElementById('CreateRoom')

CreateRoom.onclick=()=>{
    socket.emit('create-room','hi')

}
