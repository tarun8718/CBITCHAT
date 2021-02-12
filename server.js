const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');


const app= express();
server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname,'Public')));

io.on('connection',socket => {

    socket.emit('message','Welcome to Chat!');

    socket.broadcast.emit('message','A user has joined the chat!');

    socket.on('disconnect',() => {
        io.emit('message','A user has left the chat!');
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT,() => console.log(`Server listening on ${PORT}`));