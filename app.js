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

server.listen(port, function(){
  console.log("Server is up and running at port " + port);
});

// Chatroom

var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;
  console.log("A user has been Added");
  // when the client emits 'new message', this listens and executes
  // socket.on('new message', function (data) {
  //   // we tell the client to execute 'new message'
  //   socket.broadcast.emit('new message', {
  //     username: socket.username,
  //     message: data
  //   });
  // });
});
