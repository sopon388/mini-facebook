const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();


// 🔥 BODY LIMIT
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
  limit: '50mb',
  extended: true
}));


app.use(cors());


// 🔥 TEST ROUTE
app.get('/', (req, res) => {
  res.send('Backend Running 🚀');
});


// 🔥 MONGODB ATLAS CONNECT
mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log('MongoDB Connected');

})
.catch((err) => {

  console.log('MongoDB Error:', err);

});


// 🔥 ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/messages', require('./routes/messages'));


// 🔥 SOCKET SERVER
const server = require('http').createServer(app);

const io = require('socket.io')(server, {

  cors: {
    origin: "*",
    methods: ["GET", "POST"]
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

      io.to(receiverSocket).emit(
        'receiveMessage',
        data
      );

    }

  });


  // 🔥 DISCONNECT
  socket.on('disconnect', () => {

    console.log('User disconnected');

  });

});


// 🔥 PORT
const PORT = process.env.PORT || 5000;


// 🔥 SERVER START
server.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});