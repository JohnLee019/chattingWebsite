const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// 정적 파일 서비스 (프론트 HTML)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 간단한 라우팅 테스트
app.get('/api/ping', (req, res) => {
  res.send('pong');
});

// Socket.IO 이벤트
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

// 서버 실행
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});