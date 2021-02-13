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
        socket.emit('message',formatMessage(user.room, 'chatBot', 'Welcome to Chat!'));
        

        socket.broadcast.to(user.room).emit('message',formatMessage(user.room, 'chatBot', `${user.username} has joined the chat!`));
        
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    socket.on('chatMessage',(msg) => {

        const user = getCurrentUser(socket.id);

        const mesg = formatMessage(user.room, user.username, msg);

        const room = new Room({
            room: mesg.room,
            username: mesg.username,
            text: mesg.text,
            time: mesg.time
        });
        room.save();

        io.to(user.room).emit('message', mesg);
    });

    socket.on('disconnect',() => {

        const user = userLeaves(socket.id);

        if(user){
            io.to(user.room).emit('message',formatMessage(user.room, 'chatBot', `${user.username} has left the chat!`));

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
        
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT,() => console.log(`Server listening on ${PORT}`));