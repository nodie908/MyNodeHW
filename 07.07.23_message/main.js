const express = require('express');
const http = require('http');
const { Server: Io } = require("socket.io");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Io(server);

app.use(express.static('pub'));

app.get('/', (req, res) => {
    const fname = path.join(process.cwd(), 'index.html');
    res.sendFile(fname);
});

server.listen(3000, () => {
    console.log('listening on*:3000');
});

let connections = [];

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    connections.push(socket.id);
    updateConnectionList();

    socket.on("message", (data) => {
        io.emit("message", data);
    });

    socket.on("privateMessage", (data) => {
        const targetSocket = io.sockets.sockets.get(data.to);
        if (targetSocket) {
            targetSocket.emit("privateMessage", { text: data.text, from: socket.id, to: data.to });
        }
    });

    socket.on("disconnect", () => {
        const index = connections.indexOf(socket.id);
        if (index > -1) {
            connections.splice(index, 1);
            updateConnectionList();
        }
        console.log('user disconnected', socket.id);
    });
});

function updateConnectionList() {
    io.emit('connectionList', connections);
}
