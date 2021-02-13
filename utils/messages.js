const moment = require('moment');

function formatMessage(room, username, text) {
    return {
        room,
        username,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;