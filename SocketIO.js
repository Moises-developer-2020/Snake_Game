const SocketIO=require('socket.io');

const webSocketServer={};

webSocketServer.init=(server)=>{
    //start socket IO
    const io=SocketIO(server);

        

    //cuando se conecta un nuevo cliente
    io.on('connection',(socket)=>{
        console.log('new connection',socket.id);
        
    //escuchar el evento de chat:meesage y traigo los datos (1)
        socket.on('chat:message',(data)=>{//recivo los datos
            //console.log(data);
            //le puedo cambiar el nombre como mensaje derl servidor ya que es el mensaje que envia en servidor
            io.sockets.emit('chat:message',data);//reenvio los datos

            
        });


        socket.on('chat:typing',(data)=>{
            //console.log(data);
            //el broadcast es para que lo envie a todos execto a mi
            //si no lo pongo tambien me lo envia a mi
            socket.broadcast.emit('chat:typing',data);
            
        });


        socket.on('chat:typingClear',()=>{
            
            socket.broadcast.emit('chat:typingClear');
            
        });
    });

}

module.exports=webSocketServer;