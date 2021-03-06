$(document).ready(function(){

	function closeLogin(){
		$('.login').animate({opacity: 0},500);
		setTimeout(function(){
			$('.login').css('display','none');
		},500);
	}

	console.log('Running');

	$(window).keydown(function(e){
		if(e.keyCode==13){
			username = $('input.username').val();
			console.log(username);
			closeLogin()
			// Sets the client's username
			setUsername();
		}
	});

	$('input.username').focus()

	var arenaWidth = 700;
	var tileSpace = 66;
	var n = 111;
	var shift = 13;
	var tileSet = 14;

	$('.tile-wrapper').css('width', arenaWidth + 'px');
	$('.player-wrapper').css('width', arenaWidth + 200 + 'px');
	$('.header').css('width', arenaWidth + 200 + 'px');

	var multiple = 0;
// Populating the Tiles
	for(var i = 0; i <= n; i++)
	{
		if( i >= tileSet * (multiple + 1)){
			multiple++;
		}
		if( multiple % 2 == 0){
			$('.tile-wrapper').append("<div class='tile shift-left' id = '" + i + "'></div>");
		} else {
			$('.tile-wrapper').append("<div class='tile shift-right' id = '" + i + "'></div>");
		}
	}

	$('.shift-left').css('left','-' + shift + 'px');
	$('.shift-right').css('left', shift + 'px');

	var time = 25;
	$('.time').text(time);

// Establishing Socket Connections
	//$.getScript('js/socket.js'); // This was repeated initialization of socket, causing the major issue

});
