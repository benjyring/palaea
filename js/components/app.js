// _Constants/Variables
var codeArray = {'01':'a','02':'b','03':'c','11':'d','12':'e','13':'f','14':'g','15':'h','16':'i','21':'j','22':'k','23':'l','24':'m','25':'n','26':'o','31':'p','32':'q','33':'r','34':'s','35':'t','36':'u','41':'v','42':'w','43':'x','44':'y','45':'z','46':'A'},
	vph = app.viewport.h,
	vpw = app.viewport.w,
	map = document.getElementById('map'),
	ctx = map.getContext('2d'),
	game,
	maxZoom = 16,
	zoom = 1,
	sideLen = 4,
	twoWeeks = 14,
	maxTurns = 365;

var minZoom = Math.max(Math.ceil(vpw/(totalX*sideLen)), Math.ceil(vph/(totalY*sideLen)));

//
// +++++++++++++++++++++++++++++++++++++++++++
//

function cellOffset(d){
	return ({
		x: Math.round(app.viewport._offset.x/d),
		y: Math.round(app.viewport._offset.y/d)
	});
}

function drawAvailable(elX, elY, d, callback){
	// Limits the portion of the map drawn to only what's
	// within the viewport. Greatly improves performance.
	// var _elx = elX;
	// var _ely = elY;
	var _elx = elX - cellOffset(d).x;
	var _ely = elY - cellOffset(d).y;

	if ((_elx-1) < Math.ceil(vpw/d) && (_ely-1) < Math.ceil(vph/d) ){
		callback();
	}
}

function drawOffset(elX, elY, d, callback){
	if ((elX) > cellOffset(d).x){
		if ((elY) > cellOffset(d).y){
			callback();
		}
	}
}

function displayGrid(d){
	displayGridCompleted = false;

	$.each(cellArray, function(i, el){
		drawOffset(el.x, el.y, d, function(){
			drawAvailable(el.x, el.y, d, function(){
				if (el.env.type != 'placeholder'){
					ctx.drawImage(
						document.getElementById(el.env.type),
						(d*((el.x - cellOffset(d).x)-1)),
						(d*((el.y - cellOffset(d).y)-1)),
						d,
						d
					);
				}
			});
		});

		if (i === cellArray.length-1){
			displayGridCompleted = true;
		}
	});
}

function displayPops(d){
	displayPopsCompleted = false;

	$.each(popArray, function(i, el){
		var img;

		// Determine which icon to draw
		if (el.myPop === true){
			img = document.getElementById('human');
		} else {
			img = document.getElementById('mammoth');
		}

		drawOffset(el.location.x, el.location.y, d, function(){
			drawAvailable(el.location.x, el.location.y, d, function(){
				ctx.drawImage(
					img,
					(d*((el.location.x - cellOffset(d).x)-1)),
					(d*((el.location.y - cellOffset(d).y)-1)),
					img.width,
					img.height
				);
			});
		});

		if (i === popArray.length-1){
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
		map.width = vpw;
		map.height = vph;

		displayGrid(sideLen*d);

		fireOnCompletion(displayGridCompleted, function(){
			displayPops(sideLen*d);
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
	$('document').ready(function(){
		setTimeout(function(){
			$('#map').css('margin-top', $('#ui-header').height() + 'px');

			game = new Game(1, rand(twoWeeks, Math.floor(maxTurns/twoWeeks)), (maxTurns-twoWeeks), maxTurns);

			updateUI(myPop);
			mapVis(minZoom);
		}, 1000);
		zoom = minZoom;
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
		if (zoom < maxZoom && app.mouse.down === false){
			zoom = zoom+1;
			mapVis(zoom);
		}
	}
	function zoomOut(){
		if (zoom > minZoom && app.mouse.down === false){
			zoom = zoom-1;
			mapVis(zoom);
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
