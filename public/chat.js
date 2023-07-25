//para conectar
const socket=io();

var output=document.getElementById('output');
var action=document.getElementById('action');
var btn=document.getElementById('send');
var username=document.getElementById('username');
var message=document.getElementById('message');

btn.onclick=function(){
    //enviar los datos al servidor le coloco un nombre para llamarlo en el servidor
    socket.emit('chat:message',{ //(1) //envio los datos
       message:message.value,
       username:username.value
    });  
};

socket.on('chat:message',(data)=>{//el evento que el servidor me envia
    console.log(data);
    action.innerHTML ='';//para limpiar el esta escribiendo

    output.innerHTML +=`<p><strong>${data.username}:</strong> ${data.message}</p>`;
    
});

//evento cundo es escribiendo

    message.onkeypress=function(){
       
       
        socket.emit('chat:typing',username.value);
     
       
    }
   
window.onclick=function(){
    if(!message.onfocus){
        socket.emit('chat:typingClear');

    }
}    
        
   



//para recibor los datso del tipeo
socket.on('chat:typing',(data)=>{
    action.innerHTML=`<p><em>${data}</em> esta escribiendo</p>`;
});



//para recibor los datso del tipeo
socket.on('chat:typingClear',()=>{
    action.innerHTML='';
});
