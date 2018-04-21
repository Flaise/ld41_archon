const http = require('http');
const io = require('socket.io');

const server = http.Server();
const socket = io(server);

socket.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

server.listen(3000, function() {
    console.log('listening on *:3000');
});
