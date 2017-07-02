var username;
var connected = false;

var socket = io();

// Under-Development: Sweeping the Tile, removing it from DOM
$('.tile').click(sweepTile($(this).attr('id')));

function sweepTile (tileID) {
	socket.emit('tile sweep attempted', tileID)
}
