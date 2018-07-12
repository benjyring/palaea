// _Constants/Variables
var codeArray = {'01':'a','02':'b','03':'c','11':'d','12':'e','13':'f','14':'g','15':'h','16':'i','21':'j','22':'k','23':'l','24':'m','25':'n','26':'o','31':'p','32':'q','33':'r','34':'s','35':'t','36':'u','41':'v','42':'w','43':'x','44':'y','45':'z','46':'A'},
	map = document.getElementById('map'),
	ctx = map.getContext('2d'),
	game,
	zoom = 1,
	sideLen = 4,
	twoWeeks = 14,
	maxTurns = 365;

function displayGrid(d){
	displayGridCompleted = false;

	$.each(cellArray, function(i, el){
		if (el.env.type != 'placeholder'){
			ctx.drawImage( document.getElementById(el.env.type), ((d*el.x)-d), ((d*el.y)-d), d, d );
		} else {
			ctx.fillStyle = el.env.color;
			ctx.fillRect( ((d*el.x)-d), ((d*el.y)-d), d, d );
		}

		if (i === cellArray.length - 1){
			displayGridCompleted = true;
		}
	});
}

function displayPops(d){
	displayPopsCompleted = false;

	$.each(popArray, function(i, el){
		var img;

		if (el.myPop === true){
			img = document.getElementById('human');
		} else {
			img = document.getElementById('mammoth');
		}

		ctx.drawImage( img, (d*el.location.x)-d, (d*el.location.y)-d, img.width, img.height );

		if (i === popArray.length - 1){
			displayPopsCompleted = true;
		}
	});
}

(function($){

"use strict";

// Custom code goes here.
$(function(){

	window.mapVis = function(d){
		// Visualize map
		map.width = totalX*d;
		map.height = totalY*d;

		displayGrid(d);

		fireOnCompletion(displayGridCompleted, function(){
			displayPops(d);
		});
	};

	// _Save Game
	function saveGameAsString(){
		var saveGame = [];
		var sameCellIndex = 1;

		for (i = 0; i < cellArray.length; i++){
			var cc = cellArray[i].z + '' + cellArray[i].m,
			cellToPush = codeArray[cc],
			cp,
			cellToCheck;

			if (i > 0){
				cp = cellArray[i-1].z + '' + cellArray[i-1].m;
				cellToCheck = codeArray[cp];

				if (cellToPush != cellToCheck){
					if (sameCellIndex != 1){
						saveGame.push(sameCellIndex);
						sameCellIndex = 1;
					}
					saveGame.push(cellToPush);
				} else {
					sameCellIndex++;
				}
			} else {
				saveGame.push(cellToPush);
			}
		}

		saveGame = saveGame.join("");
		return saveGame;
	}

	function rebuildGameFromSave(){
		var savedGame = $('#loadSavedGame input').val();
		var sameCellIndex = 1;

		// cellArray = [];

		// // THESE NOTES ARE A START, BUT INCOMPLETE
		// for (i = 0; i < savedGame.length; i++){
		// 	for (var r = 0; r < totalX; ++r){
		// 		for (var c = 0; c < totalY; ++c){
		// 			var newMapCell = new mapCell(c+1,r+1,z,m);
		// 			cellArray.push(newMapCell);
		// 		}
		// 	}
		// }
		return savedGame;
	}

	// _GAME
	function Game(turn, nextMajorEvent, suddenDeath, endGameTurn){
		this.turn = turn;
		this.nextMajorEvent = nextMajorEvent;
		this.suddenDeath = suddenDeath;
		this.endGameTurn = endGameTurn;
	}

	// _Update UI
	window.updateUI = function(player){
		$('.counter-population').text(player.population);
		$('.counter-health').text(player.health);
		$('.counter-morale').text(player.morale);
		$('.counter-water').text(player.water);
		$('.counter-food').text(player.food);

		$('.counter-ap').text(player.ap);
		$('.counter-turn').text(player.turn);
	};

	// ON INTERACTIONS/UI
	// _Build Map
	$('#buildMap').click(function(){
		$('#pregame').remove();
		$('#ui-header, #ui-sidebar').removeClass('hidden');
		$('#map').css('margin-top', $('#ui-header').height() + 'px');

		game = new Game(1, rand(twoWeeks, Math.floor(maxTurns/twoWeeks)), (maxTurns-twoWeeks), maxTurns);

		updateUI(myPop);
		mapVis(sideLen);
	});

	$('#main-menu-opener').click(function(){
		$('#ui-sidebar').toggleClass('open');

		if ($(this).text() === 'X'){
			$(this).text('MENU');
		} else {
			$(this).text('X');
		}
	});

	$('#loadRebuildMap').click(function(){
		if ($(this).text() == 'Cancel'){
			$(this).text('Load Saved Game');
		} else {
			$(this).text('Cancel');
		}
	});
	// _Save Game
	$('#saveGame').click(function(){
		alert(saveGameAsString());
	});
	$('#rebuildMap').click(function(){
		rebuildGameFromSave();
	});
	// _Colors
	$('#colorPalette').click(function(){
		$('#colors').toggleClass('visible');
	});

	// _Zoom
	function zoomIn(){
		if (zoom < 16){
			zoom = zoom + 1;
			mapVis(sideLen*zoom);
		}
	}
	function zoomOut(){
		if (zoom > 1){
			zoom = zoom - 1;
			mapVis(sideLen*zoom);
		}
	}
	$('#zoomIn').click(function(){
		zoomIn();
	});
	$('#zoomOut').click(function(){
		zoomOut();
	});
	$('#map').on('wheel', function(e){
		// Does not work in old versions of IE and Safari
		if (e.originalEvent.deltaY < 0){
			zoomIn();
		} else {
			zoomOut();
		}
	});
	$(document).bind('keypress', function(e){
		//+
		if(e.charCode==61){
			zoomIn();
		}
		//-
		if(e.charCode==45){
			zoomOut();
		}
		//W
		if(e.charCode==119){
			move(myPop, whereTo(myPop, 0, -1));
		}
		//A
		if(e.charCode==97){
			move(myPop, whereTo(myPop, -1, 0));
		}
		//S
		if(e.charCode==115){
			move(myPop, whereTo(myPop, 0, 1));
		}
		//D
		if(e.charCode==100){
			move(myPop, whereTo(myPop, 1, 0));
		}
	});

});

}(jQuery));
