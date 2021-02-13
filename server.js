const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app= express();
server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname,'Public')));

io.on('connection',socket => {

    socket.emit('message',formatMessage('chatBot', 'Welcome to Chat!'));

    socket.broadcast.emit('message',formatMessage('chatBot', 'A user has joined the chat!'));

    socket.on('disconnect',() => {
        io.emit('message',formatMessage('chatBot', 'A user has left the chat!'));
    });

    socket.on('chatMessage',(msg) => {
        io.emit('message', formatMessage('USER', msg));
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT,() => console.log(`Server listening on ${PORT}`));