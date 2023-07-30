// save user and get its id
$('#btn-save-user').onclick=()=>{
    socket.emit('saveUser',{name:$('#user-name').value,dispositive:navigator.userAgent},(resp)=>{
        let data={
            name:resp.user,
            session:resp.session,
            url:''
        }
        // save user`s session 
        setStorageData('user',data)
        // redirect to
        sentTo('choose-game')
        
    })
}
// open game-status
$('.games-content').onclick=(event)=>{
    if(event.target.classList.contains('games')){
        let game = event.target;
        setClass([{e:game,c:'focus'}])
        setClass([{e:$('.game-status'),c:'active'}])
    }
}
// create room
$('#btn-create-room').onsubmit=(event)=>{
    event.preventDefault();
    const {roomName, amountSats, maxUser, limitTime, private } = event.target;

    let newRoom={
        roomName:roomName.value,
        amountSats:amountSats.value,
        maxUser:maxUser.value,
        limitTime:limitTime.value,
        private:private.checked
    }

    // sent info to the server
    socket.emit('create-room',newRoom, (resp)=>{
       checkAnswers(resp.status)
       sentTo('game-page');
    })
    
}

// see status of the selected room
$('.rooms-status').onclick=function(event){
    if(event.target.classList.contains('rooms')){
        let roomID=event.target.id;
        $('.rooms','all').forEach(element => {
            element.classList.remove('selected')
        });
        event.target.classList.add('selected')
        //paint selected room
       // paintSelected("#"+roomID,'selected')

       // open status-room-game
        setClass([{e:$('.status-room-game'),c:'open'}])
        
        // ask the info about the room
        socket.emit('room-info',roomID ,(resp)=>{
            checkAnswers(resp.status);
        });
    }
}

// open game-page
$('.locked').onclick=()=>{
    socket.emit('join-room',$('.btn-public-game').id,(resp)=>{
        //checkAnswers(resp.status); not becouse resp return false if the room it is full as well
        //console.log(resp);
    })
    sentTo('game-page');
}

// open and close msm content
$('#chatContent').onclick=()=>{
    if($('.game-chat ').classList.contains('active')){
        removeClass([{e:$('.game-chat '),c:'active'}]);
        return
    }
    setClass([{e:$('.game-chat '),c:'active'}]);

}
let o =0;
// btn ready to play
$('#btn-user-ready').onclick=()=>{
    // close msm
    createAlert();
    socket.emit('Im-ready-to-play');
    
    if(o == 0){
        start.click(); 
    }
    o++;
};
