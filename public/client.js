const socket = io();
let uniqUser;

const init = () => {
    addJoinUserEvent();
    addSendMessageEvent();
    addExitChatEvent();

    socket.on("update", function (update) {
        renderMessage("update", update)
    });

    socket.on("chat", function (message) {
        renderMessage("other", message)
    });
}

const addJoinUserEvent = () => {
    document.getElementById('join-user').addEventListener('click', () => {
        let username = document.getElementById('username').value;
        if (!username.length) {
            return;
        }

        socket.emit('newuser', username);
        uniqUser = username;

        document.querySelector('.join-screen').classList.remove('active');
        document.querySelector('.chat-screen').classList.add('active');
    })
}

const addSendMessageEvent = () => {
    document.getElementById('send-message').addEventListener('click', () => {
        sendMessage();
    })

    document.getElementById('message-input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

const addExitChatEvent = () => {
    document.getElementById('exit-chat').addEventListener('click', () => {
        socket.emit('exituser', uniqUser);
        window.location.href = '';
    })
}

const renderMessage = (type, message) => {
    const createMessageElement = (type, message) => {
        switch (type) {
            case "my": {
                const el = document.createElement('div');
                el.setAttribute('class', 'message my-message');
                el.innerHTML = `<div>
                                <div class="name">You</div>
                                <div class="text">${message.text}</div>
                            </div>`;
                return el;
            }
            case "other": {
                const el = document.createElement('div');
                el.setAttribute('class', 'message other-message');
                el.innerHTML = `<div>
                                <div class="name">${message.username}</div>
                                <div class="text">${message.text}</div>
                            </div>`;
                return el;
            }
            case "update": {
                const el = document.createElement('div');
                el.setAttribute('class', 'update');
                el.innerHTML = message;
                return el;
            }
            default:
                console.debug("Unknown event type: " + type);
                return;
        }
    }

    let messageContainer = document.querySelector('.chat-screen .messages');
    const newMessageElement = createMessageElement(type, message);
    messageContainer.appendChild(newMessageElement);
}


const sendMessage = () => {
    let message = document.getElementById('message-input').value;
    if(!message.length) {
        return;
    }
    renderMessage('my', {
        username: uniqUser,
        text: message
    });
    socket.emit('chat', {
        username: uniqUser,
        text: message
    })
    document.getElementById('message-input').value = '';
}

init();
