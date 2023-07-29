(()=>{
    checkSession()
})()

// answer from server
socket.on('create-room-answer',(resp)=>{
    const element = `<div class="rooms ${resp.private == true? 'private': ''}" id="${resp.id}">
                            <span class="btn-join">
                                <img src="./img/${resp.private == true? 'lock.png': 'usersWhite.png'}" alt="">
                            </span>
                            <div>
                                <span class="name-room">${resp.nameRoom}</span>
                                <span class="user-connected">${resp.usersIn.length}/${resp.maxUsers}</span>
                            </div>
                    </div>`;

    // add the new room to the page as first
    $('.rooms-status').innerHTML= element + $('.rooms-status').innerHTML;
    
    // update online rooms number
    $('#onlineRooms').innerHTML= $('.rooms','all').length;

})

// paint data status-room-game
// paint data to all users seeing this room's status
socket.on('room-info-answer',(resp)=>{
    if(resp != false){
        let roomSelected = $('.rooms','all');
        let indexAllUser;
        roomSelected.forEach((element, i)=>{
            if(element.id == resp.id){
                indexAllUser = i;
            }
        });
        if(indexAllUser != -1){
            // paint data on game-rooms to the all users
            $('.user-connected','all')[indexAllUser].innerHTML=resp.usersIn.length+'/'+resp.maxUsers;
        }


        let index;
        for (let i = 0; i < roomSelected.length; i++) {
            if(roomSelected[i].classList.contains('selected')){
                index=i;
                break;
            }
        }
        if(index != -1){
            if(roomSelected[index].id == resp.id){
                
                // paint data just to the users looking the status-room-game of this room
                $('.name-room-status').innerHTML=resp.nameRoom;
                $('#amounSats').innerHTML=resp.amounSats+ ' Sats';
                $('#maxUsers').innerHTML=resp.usersIn.length+'/'+resp.maxUsers;
                $('#limitTime').innerHTML=resp.limitTime + ' Minutes';
                $('.btn-public-game').setAttribute('id',resp.id);

                if(!resp.private){
                    $('.locked').classList.remove('private');
                }else{
                    $('.locked').classList.add('private');

                }
                $('.users-playing').innerHTML='';
                for (let i = 0; i < resp.usersIn.length; i++) {
                    //$('.user'+(i+1)).classList.add('open1');
                    $('.users-playing').innerHTML +=`<div class="user${(i+1)} userss">
                            <img src="./img/men.png" alt="">
                            <span class="user-playing-name user2Name">${resp.usersIn[i].name}</span>
                    </div>`;
                }


            }
        }            
    }
})

// to all users in the same room
socket.on('userInThisRoom',(resp)=>{
    console.log(resp);
})