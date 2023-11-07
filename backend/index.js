const express = require('express');
const { Server } = require('socket.io');
const { join } = require('node:path');
const { createServer } = require('node:http');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/canvas');
});

app.get('/canvas', (req, res) => {
    res.sendFile(join(__dirname, '/public/views/canvas/', 'canvas.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(join(__dirname, '/public/views/login/', 'login.html'));
});

// app.get('/', (req, res) => {
//   res.send('<h1>Hello world</h1>');
// });

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('event', (event) => {
        console.log('event: ' + event);
        socket.broadcast.emit('event', event);
    });    
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});