(function($) {

"use strict";

// Custom code goes here.
$(function() {

	///////////////////////////////
	// ======================
	// TABLE OF CONTENTS
	//
	// _Colors
	// _Visualize Map
	// _UI
	// ======================
	///////////////////////////////

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

	var map = document.getElementById('map'),
	ctx = map.getContext('2d'),
	zoom = 0,
	sideLen = 4;

	mapBorderContinents(function(){
		$.each(cellArray, function(index, i) {
			if (i.continent > (continentsArray.length / 2) || continentsArray[i.continent].mapBorder == true){
				// SEA
				i.inland = false;

				if (i.continentBorder != true){
					i.level = 0;
					i.moisture = 3;
					i.z = -5;
				} else {
					if (i.z >= 20){
						// Island Centers
						if (i.z < 32) {
							i.level = Math.ceil(((i.z - 6)/8) * 1);
							i.moisture = Math.ceil(((i.z - 6)/5) * 1);
						} else {
							i.level = 4;
							i.moisture = 6;
						}
					} else {
						i.level = 0;
						if (i.z > 5){
							// Reefs
							i.moisture = 2;
							i.z = -3;
						} else {
							// This creates texture in reefs,
							// to break up some long archipelegos
							i.moisture = 3;
							i.z = -5;
						}
					}
				}
			} else {
				// LAND
				i.inland = true;

				if (i.z > 0 && i.z < 5){
					i.level = 1;
					// Random moisture is temporary for proof of concept.
					// Eventually, moisture will be determined by an average of
					// distance from water and distance from mountain (z<20)
					i.moisture = rand(1, 6);
				} else if (i.z >= 5 && i.z < 10){
					i.level = 2;
					i.moisture = rand(1, 6);
				} else if (i.z >= 10 && i.z <= 15){
					i.level = 3;
					i.moisture = rand(1, 6);
				} else if (i.z >= 15 && i.z < 20){
					i.level = 4;
					i.moisture = rand(1, 3);
				} else if (i.z >= 20){
					i.level = 4;
					i.moisture = rand(4, 6);
				} else {
					i.level = 0;
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
			ctx.fillStyle = colorsArray['env' + i.level + i.moisture];
			ctx.fillRect(((d*i.x)-d), ((d*i.y)-d), d, d);
		});
	}

	$('#buildMap').click(function(){
		mapVis(sideLen);
	});


	// _UI
	// __Colors
	$('#colorPalette').click(function(){
		$('#colors').toggleClass('visible');
	});

	// __Zoom
	$('#zoomIn').click(function(){
		if (zoom < 4) {
			zoom = zoom + 1;
			sideLen = sideLen*zoom;
			mapVis(sideLen);
		}
	});
	$('#zoomOut').click(function(){
		if (zoom > 0) {
			zoom = zoom - 1;
			sideLen = sideLen*zoom;
			mapVis(sideLen);
		}
	});

});

}(jQuery));
