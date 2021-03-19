const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

socket.emit('joinRoom', { username, room });

socket.on('initialize',(data,username) => {
    for(i=0;i<data.length;i++)
    {
        if(data[i].username === username)
        {
            outputUserMessage(data[i]);
        }
        else
        {
            outputMessage(data[i]);
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

socket.on('roomUsers',({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

chatForm.addEventListener('submit',(e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;
    
    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

socket.on('message', MSG => {
    const message = MSG.message;
    if(MSG.message.username === username)
    {
        outputUserMessage(message);
    }
    else if(MSG.message.username === 'chatBot')
    {
        outputChatBotMessage(message);
    }
    else
    {
        outputMessage(message);
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

function outputUserMessage(message) {
    const div = document.createElement('div');
    div.classList.add('userMessage');
    div.innerHTML = `<span>${message.time}</span><p class="meta">${message.username}</p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

function outputChatBotMessage(message) {
    const div = document.createElement('div');
    div.classList.add('chatbotMessage');
    div.innerHTML = `<p class="meta">${message.username}</p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<span>${message.time}</span><p class="meta">${message.username}</p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}