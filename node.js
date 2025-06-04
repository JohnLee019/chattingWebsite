const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/ping', (req, res) => {
  res.send('pong');
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (username) => {
    socket.username = username;
    socket.broadcast.emit('message', `${username}님이 입장했습니다`);
  });

  socket.on('chat message', (msg) => {
    io.emit('message', `${socket.username}: ${msg}`);
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('message', `${socket.username}님이 퇴장했습니다`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});