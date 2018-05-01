// _Constants/Variables
var colorsArray = {
	env03 : '#0b0a32',
	env02 : '#1f3078',
	env01 : '#5078b3',

	env11 : '#eed19f',
	env12 : '#6c6d36',
	env13 : '#2e421d',
	env14 : '#2e421d',
	env15 : '#214c25',
	env16 : '#214c25',

	env21 : '#efb08e',
	env22 : '#6c6d36',
	env23 : '#6c6d36',
	env24 : '#34511d',
	env25 : '#34511d',
	env26 : '#3a5419',

	env31 : '#efb08e',
	env32 : '#efb08e',
	env33 : '#506b2a',
	env34 : '#506b2a',
	env35 : '#557432',
	env36 : '#557432',

	env41 : '#bb9673',
	env42 : '#9f6e50',
	env43 : '#aa622e',
	env44 : '#ffffff',
	env45 : '#ffffff',
	env46 : '#ffffff',
};
var codeArray = {'01': 'a','02': 'b','03': 'c','11': 'd','12': 'e','13': 'f','14': 'g','15': 'h','16': 'i','21': 'j','22': 'k','23': 'l','24': 'm','25': 'n','26': 'o','31': 'p','32': 'q','33': 'r','34': 's','35': 't','36': 'u','41': 'v','42': 'w','43': 'x','44': 'y','45': 'z','46': 'A'};
var map = document.getElementById('map');
// Should be constants

var ctx = map.getContext('2d');
var zoom = 1;
var sideLen = 4;

(function($) {

"use strict";

// Custom code goes here.
$(function() {

	///////////////////////////////
	// ======================
	// TABLE OF CONTENTS
	//
	// ON LOAD
	// _Constants/Variables
	// _Build Map
	// _Save Game
	// ON INTERACTIONS/UI
	// _Build Map
	// _Save Game
	// _Colors
	// _Zoom
	// ======================
	///////////////////////////////

	// _Build Map
	mapBorderContinents(function(){
		$.each(cellArray, function(index, i) {
			if (i.continent > (continentsArray.length / 2) || continentsArray[i.continent].mapBorder == true){
				// SEA
				i.inland = false;

				if (i.continentBorder != true){
					i.z = 0;
					i.moisture = 3;
				} else {
					if (i.z >= 20){
						// Island Centers
						if (i.z < 32) {
							i.z = Math.ceil(((i.z - 6)/8) * 1);
							i.moisture = Math.ceil(((i.z - 6)/5) * 1);
						} else {
							i.z = 4;
							i.moisture = 6;
						}
					} else {
						if (i.z > 5){
							// Reefs
							i.moisture = 2;
							i.z = 0;
						} else {
							// This creates texture in reefs,
							// to break up some long archipelegos
							i.moisture = 3;
							i.z = 0;
						}
					}
				}
			} else {
				// LAND
				i.inland = true;

				if (i.z > 0 && i.z < 5){
					i.z = 1;
					// Random moisture is temporary for proof of concept.
					// Eventually, moisture will be determined by an average of
					// distance from water and distance from mountain (z<20)
					i.moisture = rand(1, 6);
				} else if (i.z >= 5 && i.z < 10){
					i.z = 2;
					i.moisture = rand(1, 6);
				} else if (i.z >= 10 && i.z <= 15){
					i.z = 3;
					i.moisture = rand(1, 6);
				} else if (i.z >= 15 && i.z < 20){
					i.z = 4;
					i.moisture = rand(1, 3);
				} else if (i.z >= 20){
					i.z = 4;
					i.moisture = rand(4, 6);
				} else {
					i.z = 0;
					i.moisture = 1;
				}
			}
		});
	});

	function mapVis(d){
		// Visualize map
		map.width = totalX*d;
		map.height = totalY*d;
			// Create grid
		$.each(cellArray, function(index, i) {
			ctx.fillStyle = colorsArray['env' + i.z + '' + i.moisture];
			ctx.fillRect(((d*i.x)-d), ((d*i.y)-d), d, d);
		});
	}

	// _Save Game
	function saveGameAsString(){
		var saveGame = [];
		var sameCellIndex = 1;

		for (i = 0; i < cellArray.length; i++){
			var cc = cellArray[i].z + '' + cellArray[i].moisture,
			cellToPush = codeArray[cc],
			cp, cellToCheck;

			if (i > 0) {
				cp = cellArray[i-1].z + '' + cellArray[i-1].moisture;
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
		var savedGame = ['long', 'array', 'here'];
		var sameCellIndex = 1;

		for (i = 0; i < savedGame.length; i++){
			for (var r = 0; r < totalX; ++r){
				for (var c = 0; c < totalY; ++c){
					var newMapCell = new mapCell(c+1,r+1,z, moisture);
					cellArray.push(newMapCell);
				}
			}
		}
		return savedGame;
	}

	// ON INTERACTIONS/UI
	// _Build Map
	$('#buildMap').click(function(){
		mapVis(sideLen);
		$('#sidebar').removeClass('pregame');
		$(this).remove();
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
	// _Colors
	$('#colorPalette').click(function(){
		$('#colors').toggleClass('visible');
	});
	// _Zoom
	$('#zoomIn').click(function(){
		if (zoom < 8) {
			zoom = zoom + 1;
			mapVis(sideLen*zoom);
		}
	});
	$('#zoomOut').click(function(){
		if (zoom > 1) {
			zoom = zoom - 1;
			mapVis(sideLen*zoom);
		}
	});
	$(document).bind('keypress', function(e) {
		if(e.charCode==61){
			$('#zoomIn').click();
		}
		if(e.charCode==45){
			$('#zoomOut').click();
		}
	});

});

}(jQuery));
