$(document).ready(function(){

	arenaWidth = 700;
	tileSpace = 66;
	n = 111;
	shift = 13;
	tileSet = 14;


	multiple = 0;
	for(i=0;i<n;i++)
	{
		if(i>=tileSet*(multiple+1))
			multiple++;
		console.log(multiple);
		if(multiple%2==0)
			$('.tile-wrapper').append("<div class='tile shift-left'></div>");
		else
			$('.tile-wrapper').append("<div class='tile shift-right'></div>");
	}

	$('.shift-left').css('left','-'+ shift +'px');
	$('.shift-right').css('left', shift +'px');


});