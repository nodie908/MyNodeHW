const userName = prompt("Как вас зовут?");
let socket = io();
console.log(`Socket:${socket}`);

socket.on("message", (data) => {
    let msg = document.createElement('div');
    msg.classList.add('incom');
    msg.innerHTML = `<b>${data.from}</b>: ${data.text}`;
    let chat = document.getElementById('chat');
    chat.append(msg);
});

socket.on("connectionList", (connectionList) => {
    const connectionListElement = document.getElementById('connection-list');
    connectionListElement.innerHTML = '';
    connectionList.forEach((connectionId) => {
        const connectionItem = document.createElement('li');
        connectionItem.textContent = `${connectionId}`;
        connectionItem.addEventListener('click', () => {
            sendPrivateMessage(connectionId);
        });
        connectionListElement.appendChild(connectionItem);
    });
});

socket.on("privateMessage", (data) => {
    if (data.to === socket.id) {
        let msg = document.createElement('div');
        msg.classList.add('incom', 'private');
        msg.innerHTML = `<b>${data.from}</b>: ${data.text}`;
        let privateChat = document.getElementById('private-chat');
        privateChat.append(msg);
    }
});

myform = document.querySelector('#input-form').onsubmit = (ev) => {
    ev.preventDefault();
    let msg = document.querySelector('#input').value;
    if (msg) {
        socket.emit("message", { text: msg, from: userName, chatId: socket.id });
        document.querySelector('#input').value = '';
    }
};

function sendPrivateMessage(connectionId) {
    const msg = prompt("Введите приватное сообщение:");
    if (msg) {
        socket.emit("privateMessage", { text: msg, from: socket.id, to: connectionId });
    }
}
