const express = require('express');
const path = require('path');
const port = 5555;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", (socket) => {
    console.log('new connection!');

    socket.on("newuser", function (username) {
        console.log('username', username)
        socket.broadcast.emit("update", username + " joined the conversation");
    });
    socket.on("exituser", function (username) {
        socket.broadcast.emit("update", username + " left the conversation");
    });
    socket.on("chat", function (message) {
        socket.broadcast.emit("chat", message);
    });
})

server.listen(port, () => console.log("Server listening on port " + port));

