// _Constants/Variables
var colorsArray = {
	env03: {
		color: '#0b0a32',
		type: 'ocean'
	},
	env02: {
		color: '#1f3078',
		type: 'sea'
	},
	env01: {
		color: '#5078b3',
		type: 'placeholder'
	},
	env11: {
		color: '#eed19f',
		type: 'beach'
	},
	env12: {
		color: '#6c6d36',
		type: 'prairie'
	},
	env13: {
		color: '#2e421d',
		type: 'thickforest'
	},
	env14: {
		color: '#2e421d',
		type: 'thickforest'
	},
	env15: {
		color: '#214c25',
		type: 'evergreenforest'
	},
	env16: {
		color: '#214c25',
		type: 'evergreenforest'
	},
	env21: {
		color: '#efb08e',
		type: 'shrubland'
	},
	env22: {
		color: '#6c6d36',
		type: 'prairie'
	},
	env23: {
		color: '#6c6d36',
		type: 'prairie'
	},
	env24: {
		color: '#34511d',
		type: 'deciduousforest'
	},
	env25: {
		color: '#34511d',
		type: 'deciduousforest'
	},
	env26: {
		color: '#3a5419',
		type: 'placeholder'
	},
	env31: {
		color: '#efb08e',
		type: 'shrubland'
	},
	env32: {
		color: '#efb08e',
		type: 'shrubland'
	},
	env33: {
		color: '#506b2a',
		type: 'lightforest'
	},
	env34: {
		color: '#506b2a',
		type: 'lightforest'
	},
	env35: {
		color: '#557432',
		type: 'rockyforest'
	},
	env36: {
		color: '#557432',
		type: 'rockyforest'
	},
	env41: {
		color: '#bb9673',
		type: 'rocky'
	},
	env42: {
		color: '#9f6e50',
		type: 'placeholder'
	},
	env43: {
		color: '#aa622e',
		type: 'placeholder'
	},
	env44: {
		color: '#ffffff',
		type: 'snow'
	},
	env45: {
		color: '#ffffff',
		type: 'snow'
	},
	env46: {
		color: '#ffffff',
		type: 'snow'
	}
},
	codeArray = {'01':'a','02':'b','03':'c','11':'d','12':'e','13':'f','14':'g','15':'h','16':'i','21':'j','22':'k','23':'l','24':'m','25':'n','26':'o','31':'p','32':'q','33':'r','34':'s','35':'t','36':'u','41':'v','42':'w','43':'x','44':'y','45':'z','46':'A'},
	map = document.getElementById('map'),
	ctx = map.getContext('2d'),
	zoom = 1,
	sideLen = 4;

function displayGrid(d){
	displayGridCompleted = false;

	$.each(cellArray, function(i, el){
		var env = colorsArray['env' + el.z.toString() + el.m.toString()];

		if (env.type != 'placeholder'){
			ctx.drawImage( document.getElementById(env.type), ((d*el.x)-d), ((d*el.y)-d), d, d );
		} else {
			ctx.fillStyle = env.color;
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

		if (containsObject(el.occupying[0], myPop.occupying)){
			img = document.getElementById('human');
		} else {
			img = document.getElementById('mammoth');
		}

		ctx.drawImage( img, (d*el.occupying[0].x)-d, (d*el.occupying[0].y)-d, img.width, img.height );

		if (i === popArray.length - 1){
			displayPopsCompleted = true;
		}
	});
}

(function($){

"use strict";

// Custom code goes here.
$(function(){

	///////////////////////////////
	// ======================
	// TABLE OF CONTENTS
	//
	// _Build Map
	// _Save Game
	// _Colors
	// _Zoom
	// ======================
	///////////////////////////////

	function mapVis(d){
		// Visualize map
		map.width = totalX*d;
		map.height = totalY*d;

		displayGrid(d);

		fireOnCompletion(displayGridCompleted, function(){
			displayPops(d);
		});
	}

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

	// ON INTERACTIONS/UI
	// _Build Map
	$('#buildMap').click(function(){
		$('#pregame').remove();
		$('#ui-header, #ui-sidebar').removeClass('hidden');
		$('#map').css('margin-top', $('#ui-header').height() + 'px');

		$('.counter-population').text(myPop.population);
		$('.counter-supplies').text(myPop.supplies);
		$('.counter-health').text(myPop.health);
		$('.counter-water').text(myPop.water);
		$('.counter-food').text(myPop.food);
		$('.counter-morale').text(myPop.morale);

		$('.counter-ap').text(4);
		$('.counter-turn').text(1);
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
		if(e.charCode==61){
			zoomIn();
		}
		if(e.charCode==45){
			zoomOut();
		}
	});

});

}(jQuery));
