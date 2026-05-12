const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 🔥 ONLY THIS PART UPDATED
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/minifb');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/friends', require('./routes/friends'));

// 🔥 NEW MESSAGE ROUTE
app.use('/api/messages', require('./routes/messages'));


// 🔥 SOCKET SERVER
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});


// 🔥 ONLINE USERS
let users = {};


// 🔥 SOCKET CONNECTION
io.on('connection', (socket) => {

  console.log('User connected');


  // 🔥 USER JOIN
  socket.on('join', (userId) => {

    users[userId] = socket.id;

    console.log(users);
  });


  // 🔥 SEND MESSAGE
  socket.on('sendMessage', (data) => {

    const receiverSocket = users[data.receiver];

    // 🔥 SEND TO RECEIVER
    if (receiverSocket) {

      io.to(receiverSocket).emit('receiveMessage', data);
    }
  });


  // 🔥 DISCONNECT
  socket.on('disconnect', () => {

    console.log('User disconnected');
  });

});


// 🔥 IMPORTANT
server.listen(5000, () => {
  console.log('Server running');
});