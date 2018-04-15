(function($) {

"use strict";

// Custom code goes here.
$(function() {

	///////////////////////////////
	// ======================
	// TABLE OF CONTENTS
	//
	// _Visualize Map
	// _UI
	// ======================
	///////////////////////////////
	var map = $('#map'),
	zoom = 0;

	mapBorderContinents(function(){
		// _Visualize Map
		if (!map.find('.cell').length){
			// Create grid
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
							i.level = 4;
							i.moisture = 4;
						} else {
							i.level = 0;
							if (i.z > 5){
								i.moisture = 2;
								i.z = -3;
							} else {
								i.moisture = 3;
								i.z = -5;
							}
						}
					}
				} else {
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

				map.append('<div class="cell env-' + i.level + '-' + i.moisture + ' ' + i.inland + '" data-x="' + i.x + '" data-y="' + i.y + '" data-z="' + i.z + '" data-continent="' + i.continent + '"></div>');
			});
		} else {
			alert('Map is already generated.');
		}
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
			$('#map').attr('data-zoom', zoom);
		}
	});
	$('#zoomOut').click(function(){
		if (zoom > 0) {
			zoom = zoom - 1;
			$('#map').attr('data-zoom', zoom);
		}
	});

});

}(jQuery));
