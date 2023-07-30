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
    // clear lasted users painted
    $('.users','all').forEach(element => {
        element.innerHTML='';
    });
    // paint data of the room
    $('#game-time').innerHTML= resp.limitTime+':00';
    detectInit(resp);

    // paint users
    for (let i = 0; i < resp.usersIn.length; i++) {
        $('.users','all')[i].innerHTML +=`${i % 2 ==0?`<div class="profile-user userGame${i}"><img src="./img/men.png" alt=""></div>`:''}
                            <div class="user-details">
                                <span>${resp.usersIn[i].name}</span>
                                <span>0 scores</span>
                            </div>
                            ${i % 2 != 0?`<div class="profile-user userGame${i}"><img src="./img/men.png" alt=""></div>`:''}
                            <div class="user-notification"><img src="./img/done.png" alt=""></div>`;
    }
})
function detectInit(resp){
    if(resp.usersIn.length == resp.maxUsers){
        // start game
        createAlert('.usersReady');
        return
    }
    createAlert('.waitingUsers');
    $('#waitingUsers').innerHTML = resp.usersIn.length+'/'+resp.maxUsers;

}

// server answer
socket.on('Im-ready-to-play-answer',(resp)=>{
    let myIndex=0;
    for (let i = 0; i < resp.length; i++) {
        if(resp[i].ready){
            setClass([{e:$('.user-notification','all')[i], c:'ready'}])
            if(resp[i].session == JSON.parse(checkAndReturn('user')).session){
                myIndex = resp[i].index;
            }
        }else{
            removeClass([{e:$('.user-notification','all')[i], c:'ready'}])
        }
    }
    // save index of this player
    const user = JSON.parse(checkAndReturn('user'));

    // this index it's to detect which direction and who send it the move
    user.index = myIndex;
    setStorageData('user',user);

    player.click();

});

socket.on('start-the-game',(resp)=>{
    // clear notification ready
    for (let i = 0; i < $('.user-notification','all').length; i++) {
        removeClass([{e:$('.user-notification','all')[i], c:'ready'}])
    }
    countdown(resp.limitTime,'#game-time')
});
