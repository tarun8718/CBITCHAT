const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose  = require('mongoose');
const Room = require('./models/roomMsgs');

mongoose.connect("mongodb+srv://tarun:tarun123@cluster0.kmv1z.mongodb.net/Chat?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
    console.log("conneted to mongo successfully");
})
mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err);
})

const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeaves, getRoomUsers } = require('./utils/users');

const app= express();
server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname,'Public')));

io.on('connection',socket => {
    socket.on('joinRoom',({ username, room}) => {

        const user = userJoin(socket.id, username, room);

        socket.join(user.room);
        Room.find({room: user.room}).exec((err,data) =>{
            socket.emit('initialize',data, user.username);
            const message = formatMessage(user.room, 'chatBot', 'Welcome to Chat!');
            const username = user.username;
            socket.emit('message', {message, username});
        });
        
        const message = formatMessage(user.room, 'chatBot', `${user.username} has joined the chat!`);

        socket.broadcast.to(user.room).emit('message', {message, username});
        
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    socket.on('chatMessage',(msg) => {

        const user = getCurrentUser(socket.id);

        const message = formatMessage(user.room, user.username, msg);

        const room = new Room({
            room: message.room,
            username: message.username,
            text: message.text,
            time: message.time
        });
        room.save();
        const username = user.username;
        io.to(user.room).emit('message', {message, username});
    });

    socket.on('disconnect',() => {

        const user = userLeaves(socket.id);

        if(user){
            const message = formatMessage(user.room, 'chatBot', `${user.username} has left the chat!`);
            const username = user.username;
            io.to(user.room).emit('message', {message, username});

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
        
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT,() => console.log(`Server listening on ${PORT}`));