// Client Side

var userID = Math.floor(Math.random()*20); // Random in Alpha
var connected = false;

var socket = io();

// Setting up Asset paths
var bombImg = "/assets/images/bombSmoothLarge.png";
var explodedImg = "/assets/images/Dead.png"

// Setting Default actions on click
var selected = 'sweep'; // 'bomb' or 'sweep'

// username and userID : Contain User details on Client Side

// DEFINING ALL FUNCTIONS
function setUsername () {

  // If the username is valid
  if (username) {
    log("Emitting add User event");

    // Tell the server your username
    socket.emit('add user', username);
  }
}

// Log a message
function log (message) {
  console.log(message);
}

// For setting up Global Consistent View
function addParticipant (data) {
  data.allPlayers.forEach(function(player, index) {
    log(player);

    var playerId = player.id;
    var playerName = player.username;
    var playerPoints = player.points;

    // update on gameboard
    var nameField = $("#player" + playerId).find('.name')[0];
    var pointsField = $("#player" + playerId).find('.points')[0];
    $(nameField).html(playerName);
    $(pointsField).html(playerPoints);
  })
}

// KEYBOARD AND MOUSE EVENTS

// Under-Development: Sweeping the Tile, removing it from DOM
$('.tile').show().unbind('click').bind('click', function() {
      var id = $(this).attr('id');
      log(username + " attempted to " + selected + " tile " + id);
      var data = {};
      log("THIS PALCE!");
// Emitting Socket Event for the Attempt to Server
      socket.emit('attempt', {
        "userID": userID,
        "tileID": parseInt(id),
        "attempt": selected
      });
});

// Toggle action 'Selected' between bomb/sweep by pressing 'Space'
$('body').show().unbind('keyup').keyup(function(e){
   if(e.keyCode == 32){
       if (selected === 'bomb'){
         selected = 'sweep';
       }
       else if (selected === 'sweep'){
         selected = 'bomb';
       }
       log("Changed selection to " + selected);
   }
});

// SOCKET EVENTS
socket.on('attemptSuccess', function(data){
  var impactedTile = $('#' + data.tileID); // Selecting the tile in consideration

  if (data.attempt === 'bomb') {
    $(impactedTile).append('<img class = "image-on-tile" src=' + bombImg + '>');
    $("#bomb-planted").get(0).play();
  }
  else if (data.attempt === 'sweep') {
    $(impactedTile).css('visibility', 'hidden');
  }
});

socket.on('someoneExploded', function(data){
  var impactedTile = $('#' + data.tileID); // Selecting the tile in consideration
  $(impactedTile).append('<img class = "image-on-tile deadTile" src=' + explodedImg + '>');

  if (userID == data.userID) {
    $("#bomb-explosion").get(0).play();
  }

})

socket.on('pointsUpdate', function (data){
  var positiveID = data.positiveID;
  var positivePoints = data.positivePoints;
  var negativeID = data.negativeID;
  var negativePoints = data.negativePoints;

  console.log(data);
  var positivePointsField = $("#player" + positiveID).find('.points')[0];
  $(positivePointsField).fadeOut(500, function() {
       $(positivePointsField).html(positivePoints).fadeIn(500);
  });

   if (negativeID) {
     var negativePointsField = $("#player" + negativeID).find('.points')[0];
     $(negativePointsField).fadeOut(500, function() {
          $(negativePointsField).html(negativePoints).fadeIn(500);
     });
   }
});

// This is used for populating the Game's User status for all User
socket.on('all players', function (data){
  addParticipant (data);
});

// Socket Connection and Reconnect Funcitons
socket.on('user joined', function (data) {

  username = data.username;
  userID = data.userID;
  log(userID + ' ' + username + ' joined');
});

socket.on('reconnect', function () {
  log('you have been reconnected');
  if (username) {
    socket.emit('add user', username);
  }
});

socket.on('reconnect_error', function () {
  log('attempt to reconnect has failed');
});
