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

	env77 : '#f46919'
};
var codeArray = {'01':'a','02':'b','03':'c','11':'d','12':'e','13':'f','14':'g','15':'h','16':'i','21':'j','22':'k','23':'l','24':'m','25':'n','26':'o','31':'p','32':'q','33':'r','34':'s','35':'t','36':'u','41':'v','42':'w','43':'x','44':'y','45':'z','46':'A'};
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

		// // Add event listener for `click` events.
		// map.addEventListener('click', function(e) {
		// 	var x = e.pageX - map.offsetLeft,
		// 	y = e.pageY - map.offsetTop;

		// 	// Collision detection between clicked offset and element.
		// 	cellArray.forEach(function(el) {
		// 		if (y > ((d*el.y)-d) && y < ((d*el.y)-d) + d && x > ((d*el.x)-d) && x < ((d*el.x)-d) + d) {
		// 			console.log('clicked cell X-' + el.x + ' Y-' + el.y);
		// 		}
		// 	});

		// }, false);

		// Create grid
		$.each(cellArray, function(i, el) {
			ctx.fillStyle = colorsArray['env' + el.z + '' + el.m];
			ctx.fillRect(
				((d*el.x)-d),
				((d*el.y)-d),
				d,
				d
			);
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

			if (i > 0) {
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
		mapVis(sideLen);
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
		if (zoom < 8) {
			zoom = zoom + 1;
			mapVis(sideLen*zoom);
		}
	}
	function zoomOut(){
		if (zoom > 1) {
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
	$('#map').on('wheel', function(e) {
		// Does not work in old versions of IE and Safari
		if (e.originalEvent.deltaY < 0) {
			zoomIn();
		} else {
			zoomOut();
		}
	});
	$(document).bind('keypress', function(e) {
		if(e.charCode==61){
			zoomIn();
		}
		if(e.charCode==45){
			zoomOut();
		}
	});

});

}(jQuery));
