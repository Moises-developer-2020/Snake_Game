// save user and get its id
$('#btn-save-user').onclick=()=>{
    socket.emit('saveUser',{name:$('#user-name').value,dispositive:navigator.userAgent},(resp)=>{
        let data={
            name:resp.user,
            session:resp.session,
            url:''
        }
        setStorageData('user',data) 
        sentTo('choose-game')
        
    })
}