const userMap = new Map(); 

function updateUserList(io) {
  const nicknames = Array.from(userMap.keys());
  io.emit('user list', nicknames);
}

function initSocket(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 [${socket.id}] connected`);

    socket.on('join', ({ nickname, announce }) => {
      socket.nickname = nickname;

      if (!userMap.has(nickname)) {
        userMap.set(nickname, new Set());

        if (announce) {
          io.emit('system message', { user: nickname, text: '입장' });
        }
      }

      userMap.get(nickname).add(socket);
      socket.emit('join_success', nickname);
      updateUserList(io);
    });

    socket.on('manual_logout', (nickname) => {
      io.emit('system message', { user: nickname, text: '퇴장' });

      if (userMap.has(nickname)) {
        userMap.delete(nickname);
        updateUserList(io); 
      }
    });

    socket.on('chat message', ({ sender, message }) => {
      if (sender && message) {
        io.emit('chat message', { sender, message });
      }
    });

    socket.on('disconnect', () => {
      const nickname = socket.nickname;
      if (!nickname || !userMap.has(nickname)) return;

      const sockets = userMap.get(nickname);
      sockets.delete(socket);

      console.log(`⚠️ ${nickname} 소켓 연결 해제됨. 잔여 연결 수: ${sockets.size}`);

      if (sockets.size === 0) {
        userMap.delete(nickname);
        io.emit('system message', { user: nickname, text: '퇴장' });
        updateUserList(io);
      }
    });

    socket.on('join_dm', ({ room, user }) => {
      socket.join(room);
      console.log(`💬 ${user} joined room ${room}`);
    });

    socket.on('dm_message', ({ room, sender, message }) => {
      io.to(room).emit('dm_message', { sender, message });
    });
  });
}

module.exports = { initSocket };
