// Client Side

var userID = Math.floor(Math.random()*20); // Random in Alpha
var connected = false;

var socket = io();

// Setting up Asset paths
var bombImg = "/assets/images/bombSmoothLarge.png";

// Setting Default actions on click
var selected = 'bomb'; // 'bomb' or 'sweep'

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

function addParticipant (data) {
  playerID = data.numUsers;
  playerName = data.username;
  console.log(playerID);
//  $("#player" + playerID).find((".name"+playerID)).css( "background-color", "red" ));
//  $("#player3").find("name").css( "background-color", "red" ));
  console.log("Did the color change?");
}

// KEYBOARD AND MOUSE EVENTS

// Under-Development: Sweeping the Tile, removing it from DOM
$('.tile').click(function() {
      var id = $(this).attr('id');
      log(username + " attempted to " + selected + " tile " + id);

      // checkStatusTile(id)
      // .then
      if (selected === "sweep") {
        $(this).css('visibility', 'hidden');
      }
      if (selected === "bomb") {
        $(this).append('<img class = "image-on-tile" src=' + bombImg + '>');
        $("#bomb-planted").get(0).play();
      }

});

// Toggle action 'Selected' between bomb/sweep by pressing 'Space'
$('body').keyup(function(e){
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
// Whenever the server emits 'user joined', log it in the chat body
socket.on('user joined', function (data) {

  addParticipant(data);
  log(data.username + ' joined');
});

socket.on('reconnect', function () {
  log('you have been reconnected');
  if (username) {
    socket.emit('add user', username);
  }
});

socket.on('all players', function (data){
  log(data);
});

socket.on('reconnect_error', function () {
  log('attempt to reconnect has failed');
});
