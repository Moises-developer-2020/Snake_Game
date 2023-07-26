//para conectar




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
