import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('join', (username: string) => {
    socket.data.username = username;
    socket.broadcast.emit('message', `${username}님이 입장했습니다`);
  });

  socket.on('chat message', (msg: string) => {
    const username = socket.data.username || 'Unknown';
    io.emit('message', `${username}: ${msg}`);
  });

  socket.on('disconnect', () => {
    const username = socket.data.username;
    if (username) {
      io.emit('message', `${username}님이 퇴장했습니다`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
