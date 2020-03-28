const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const message = require('./utils/message');
const {
  addUserToRoom,
  removeUserFromRoom,
  getCurrentUser,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Use public folder as static folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle client connections
io.on('connection', socket => {
  /*
    ? socket.emit() emits to connecting user
    ? socket.broadcast.emit() emits to all users except the connecting user
    ? io.emit() emits to all connected users
  */

  const botName = 'ChattrBot';

  socket.on('joinRoom', ({
    username,
    room,
  }) => {
    const user = addUserToRoom(socket.id, username, room);
    socket.join(user.room);

    // Welcome message for connecting user
    socket.emit('message', message(botName, 'Welcome to Chattr!'));

    // Broadcast message when an user joins
    socket.broadcast.to(user.room).emit('message', message(botName, `${user.username} has joined the chat!`));

    // Send users and room info to clients
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  })

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const currentUser = getCurrentUser(socket.id);
    io.to(currentUser.room).emit('message', message(currentUser.username, msg));
  });

  //When a client disconnects
  socket.on('disconnect', () => {
    const currentUser = removeUserFromRoom(socket.id);
    if (currentUser) {
      io.to(currentUser.room).emit('message', message(botName, `${currentUser.username} has left the chat!`));

      // Send users and room info to clients
      io.to(currentUser.room).emit('roomUsers', {
        room: currentUser.room,
        users: getRoomUsers(currentUser.room)
      });
    }
  })
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));