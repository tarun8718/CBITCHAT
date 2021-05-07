const mongoose = require('mongoose');
const newRoomSchema = new mongoose.Schema({
    status:{
        type:String,
        required:true
    },
    roomname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:false
    }
}, {timestamps: true });

const newRoom = mongoose.model('newRoom',newRoomSchema);

module.exports = newRoom;