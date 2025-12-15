// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // React側のURLに合わせて制限してもOK
    methods: ['GET', 'POST'],
  },
});

const rooms = {}; // 各部屋の参加者と勉強時間を保持

io.on('connection', (socket) => {
  console.log('✅ ユーザー接続:', socket.id);

  socket.on('joinRoom', ({ roomId, userName, duration }) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = {};
    rooms[roomId][socket.id] = { userName, duration: duration || 0 };
    io.to(roomId).emit('roomUpdate', rooms[roomId]);
  });

  socket.on('updateDuration', ({ roomId, duration }) => {
    if (rooms[roomId] && rooms[roomId][socket.id]) {
      rooms[roomId][socket.id].duration = duration;
      io.to(roomId).emit('roomUpdate', rooms[roomId]);
    }
  });

  socket.on('chatMessage', ({ roomId, userName, message }) => {
    io.to(roomId).emit('chatUpdate', { userName, message });
  });

  socket.on('disconnect', () => {
    console.log('❌ ユーザー切断:', socket.id);
    for (const roomId in rooms) {
      if (rooms[roomId][socket.id]) {
        delete rooms[roomId][socket.id];
        io.to(roomId).emit('roomUpdate', rooms[roomId]);
      }
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Socket.IO サーバー起動中 → http://localhost:${PORT}`);
});