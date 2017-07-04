// Server Side
var express = require('express');
var http = require('http');
var port = 1111;

var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server);

app.use(express.static('public'));
app.use(express.static('src/views'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

function log (message) {
  console.log(message);
}

server.listen(port, function(){
  log("Server is up and running at port " + port);
});

// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;
  log("A user has been added");

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    log('add user event emitted');
    if (addedUser) return;
    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;

    // echo globally (all clients) that a person has connected
    socket.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
    log(socket.username + " Added. Total users " + numUsers);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });

      console.log(socket.username + " left. Total users " + numUsers);
    }
  });


});
