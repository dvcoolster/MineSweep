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

var gameBoard = {
  "allPlayers": [],
  "allTiles": []
};

var EventEmitter = require('events');

var User = function(id, username) {

  // making it unique for the user
  this.id = id;
  this.username = username;
  this.points = 0;

  // Deafult Values: initiating the resources
  var bombs = 5;
  var sweeps = 0;


  // these are public methods
  this.addBomb = function() {
    bomb ++;
  };
  this.removeBomb = function() {
    bomb --;
  };
  this.getBombs = function() {
    return bombs;
  };

  this.addSweep = function() {
    speed ++;
  };
  this.removeSweep = function() {
    sweep --;
  };
  this.getSweeps = function() {
    return sweeps;
  };

  this.addPoint = function() {
    this.points ++;
  };
  this.removePoint = function() {
    points --;
  };
  this.getPoints = function() {
    return this.points;
  };

};

var Tile = function (id, positive, negative) {
  this.id = id,
  this.status = 'idle', // 'bomb', 'sweep', 'exploded'
  this.positive = 0,  // ID of player who may get positive outcome
  this.negative = 0  // ID of player who got negative outcome
};

// Create Default Game State
var n = 111;
for(var i = 0; i <= n; i++)
{
  tile = new Tile(i);
  gameBoard.allTiles.push(tile);
}

// Game Functions

function successAttemptUpdate (data, socket) {
  gameBoard.allTiles[data.tileID].status = data.attempt;
  gameBoard.allTiles[data.tileID].positive = data.userID;
  if (data.attempt == 'bomb') {
    socket.emit('attemptSuccess', data);
  }

  if (data.attempt == 'sweep') {
    io.emit('attemptSuccess', data);
    updatePointsSweeped(data);
  }
  // console.log(data.tileID + " successfully " + data.attempt);

};

function userHasExploded (data) {
  log(data);
  gameBoard.allTiles[data.tileID].status = 'exploded';
  gameBoard.allTiles[data.tileID].negative = data.userID;

  io.emit('someoneExploded',data)
  updatePointsExploded(data);
};

function failedAttemptUpdate (data) {
  log(data);
};

function updatePointsSweeped (data) {
  var resultPoints = ++gameBoard.allPlayers[data.userID - 1].points;

  var points = {};
  points["positiveID"] = data.userID;
  points["positivePoints"] = resultPoints;
  points["negativeID"] = 0;
  points["negativePoints"] = 0;

  io.emit('pointsUpdate', points);

}

function updatePointsExploded (data) {

  var points = {};
  points["positiveID"] = data.positiveID;
  points["positivePoints"] = gameBoard.allPlayers[data.positiveID - 1].points + 2;
  points["negativeID"] = data.userID;
  points["negativePoints"] = --gameBoard.allPlayers[data.userID - 1].points;
  // There is -1 in IDs because USER ID starts from 1, and index starts from 0
  // Game State update
  gameBoard.allPlayers[data.positiveID - 1].points = points["positivePoints"];

  // Emit Score changes to everyone
  io.emit('pointsUpdate', points);
}

// SOCKET CONNECTIONS AND FUNCTIONS
io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
//    log('add user event emitted');
    if (addedUser) return;

    if(gameBoard.allPlayers.length >= 4) {
      log("Lobby is full. Cannot add more players");
      return;
    }
    socket.username = username;
    socket.userID = gameBoard.allPlayers.length + 1;
    ++numUsers;
    addedUser = true;

    // Add user to Global Game State
    gameBoard.allPlayers.push(new User(socket.userID, socket.username));

    //Echo to the Client that he has successfully Joined
    socket.emit('user joined', {
      "username": socket.username,
      "userID": socket.userID
    });

    io.emit('all players', gameBoard);
  });

  socket.on('attempt', function checkAttempt (data) {

    // If the Tile is Empty
    var tileStatus = gameBoard.allTiles[data.tileID].status;
    var tilePositive = gameBoard.allTiles[data.tileID].positive;
    if (tileStatus === 'idle') {
      successAttemptUpdate(data, socket);
    }

    if (tileStatus === 'bomb' && (data.userID != tilePositive)) {
      data.positiveID = tilePositive;
      userHasExploded(data);
    }

  })
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
