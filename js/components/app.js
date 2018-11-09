// _Constants/Variables
var codeArray = {'01':'a','02':'b','03':'c','11':'d','12':'e','13':'f','14':'g','15':'h','16':'i','21':'j','22':'k','23':'l','24':'m','25':'n','26':'o','31':'p','32':'q','33':'r','34':'s','35':'t','36':'u','41':'v','42':'w','43':'x','44':'y','45':'z','46':'A'},
	vph = app.viewport.h,
	vpw = app.viewport.w,
	map = document.getElementById('map'),
	ctx = map.getContext('2d');

var minZoom = Math.max(Math.ceil(vpw/(app.totalX*sideLen)), Math.ceil(vph/(app.totalY*sideLen)));

//
// +++++++++++++++++++++++++++++++++++++++++++
//

function cellOffset(d){
	return ({
		x: Math.round(app.viewport._offset.x/d),
		y: Math.round(app.viewport._offset.y/d)
	});
}

function setAnimalSpecies(el, env, carnivore, herbivore){
	if (el.location.env.type === env){
		if (el.type === 'carnivore'){
			el.species = carnivore;
		} else {
			el.species = herbivore;
		}
	}
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

function drawCurrentWithOffset(context, id, location, d, width, height){
	context.drawImage(
		document.getElementById(id),
		(d*((location.x - cellOffset(d).x)-1)),
		(d*((location.y - cellOffset(d).y)-1)),
		width,
		height
	);
}

// function ifInPreviousArray(iteration, el){
// 	var iteration = 0;

// 	if (el.env.type === previousArray[i].)
// }

function displayGrid(d){
	app.displayGrids = false;

	$.each(cellArray, function(i, el){
		drawOffset(el.x, el.y, d, function(){
			drawAvailable(el.x, el.y, d, function(){
				if (el.env.type != 'placeholder'){
					drawCurrentWithOffset(ctx,el.env.type,el,d,d,d);
				}
			});
		});

		if (i === cellArray.length-1){
			app.displayGridCompleted = true;
		}
	});
}

function displayPops(d){
	app.displayPopsCompleted = false;

	$.each(popArray, function(i, el){
		var img;

		// Determine which icon to draw
		if (el.myPop === true || el.species === 'human'){
			img = document.getElementById('human');
		} else {
			if (el.species === undefined){

				if (el.location.env.type === 'water'){
					// TEMPORARY - will remove when all environment types
					// are accounted for
				} else {
					// TEMPORARY: this section needs some debugging work
					setAnimalSpecies(el, 'river', 'fish', 'fish');
					setAnimalSpecies(el, 'prairie', 'sabretooth', 'mammoth');
					setAnimalSpecies(el, 'beach', 'seal', 'seal');
					setAnimalSpecies(el, 'lightforest', 'wolf', 'elk');
					setAnimalSpecies(el, 'thickforest', 'wolf', 'elk');
					setAnimalSpecies(el, 'evergreenforest', 'wolf', 'elk');
					setAnimalSpecies(el, 'deciduousforest', 'bear', 'elk');
					setAnimalSpecies(el, 'shrubland', 'grouse', 'grouse');
					setAnimalSpecies(el, 'rockyforest', 'bear', 'bighorn');

					img = document.getElementById(el.species);
				}

			} else {
				img = document.getElementById(el.species);
			}
		}

		drawOffset(el.location.x, el.location.y, d, function(){
			drawAvailable(el.location.x, el.location.y, d, function(){
				drawCurrentWithOffset(ctx, img.id, el.location, d, img.width, img.height);
			});
		});

		if (i === popArray.length-1){
			app.displayPopsCompleted = true;
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

		fireOnCompletion(app.displayGridCompleted, function(){
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
		// 	for (var r = 0; r < app.totalX; ++r){
		// 		for (var c = 0; c < app.totalY; ++c){
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

	$('a.icon-inventory').click(function(){
		$('#inventory-modal').toggleClass('hidden');
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
