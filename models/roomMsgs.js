const mongoose = require('mongoose');
const roomMsgsSchema = new mongoose.Schema({
    room:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
}, {timestamps: true });

const Room=mongoose.model('Room',roomMsgsSchema);

module.exports = Room;