(function($) {

"use strict";

// If we run locally, the template path tag won't exist.
var template_path = window.template_path;
template_path = template_path == '{TEMPLATE_PATH}/' ? '' : template_path;

// Helper functions.
function template( tempName ) {
	// Send a class name (no dot) as an argument.
	// Whether the <body> has that class or not will be returned as boolean.
	return $('body').hasClass(tempName);
}

function get_slug() {
	return window.location.pathname.replace(/^\/|\/$/g,'');
}

function slug( slug_name, part ) {

	// Return whether the current page slug contains a given string. Use this for identifying pages to run code.
	if ( part ) {
		var reg = new RegExp( slug_name );
		return reg.test( get_slug() );

	// Return whether the current page matches a given slug. Use this for identifying pages to run code.
	} else {
		return slug_name == get_slug();
	}

}


// Custom code goes here.
$(function() {

	///////////////////////////////
	// ======================
	// TABLE OF CONTENTS
	//
	// _Create Map
	// _Visualize Map
	// _UI
	// ======================
	///////////////////////////////

	mapBorderContinents();

	var map = $('#map'),
	zoom = 0;
	// _Visualize Map
	$('button#buildMap').click(function(){
		if (!map.find('.cell').length){
			// Create grid
			$.each(cellArray, function(index, i) {

				if (i.z <= 0){
					i.level = "belowSeaLevel";
					i.texture = "sea-deep";
				} else if (i.z > 0 && i.z < 5){
					i.level = "lowlands";
					i.texture = "plains-flat";
				} else if (i.z >= 5 && i.z < 10){
					i.level = "highlands";
					i.texture = "deciduous-hills";
				} else if (i.z >= 10 && i.z <= 15){
					i.level = "foothills";
					i.texture = "rocky5";
				} else if (i.z >= 15 && i.z < 20){
					i.level = "mountains";
					i.texture = "rocky2";
				} else if (i.z >= 20){
					i.level = "aboveSnowLevel";
					i.texture = "";
				} else {
					i.level = "normal";
				}

				if (i.continent > (continentsArray.length / 2) || continentsArray[i.continent].mapBorder == true){
					// SEA
					if (i.continentBorder === true){
						i.texture = "sea-coast";
					} else {
						i.z = -5;
						i.level = "belowSeaLevel";
						i.texture = "sea-coast";
					}
				}

				// FOR GAMEPLAY
				// map.append('<div class="cell ' + i.level + ' ' + i.texture + '"></div>');
				// FOR DEVELOPMENT/DEBUGGING
				map.append('<div class="' + i.className + ' ' + i.mapBorder + ' ' + i.level + ' ' + i.texture + '" data-x="' + i.x + '" data-y="' + i.y + '" data-z="' + i.z + '" data-continent="' + i.continent + '"></div>');
			});
			// Visualize continents
			// $.each(continentsArray, function(index, i) {
			// 	$('.cell[data-x=' + i.x + '][data-y=' + i.y + ']').attr('id', 'continent-' + i.continent).attr('force', i.force).attr('direction', i.direction);
			// });
		} else {
			alert('Map is already generated.');
		}
		$('.cell').promise().done(function(){
			$('#splashscreen').remove();
		});
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

// // If you need to load or unload things based on the current media query, use Enquire:
// // http://wicky.nillia.ms/enquire.js
// Modernizr.on('load', [

// 	// Test for placeholder support, IE8 and IE9 doesn't support input placeholders, target it with '.placeholder' and other normal ways to style placeholders.
// 	{
// 		test: Modernizr.placeholder,
// 		nope: template_path + "js/jquery.placeholder.js",
// 		complete: function() {

// 			if ( ! Modernizr.placeholder ) {
// 				$('input[placeholder]').placeholder();
// 			}

// 		}
// 	},

// 	// Test if polyfill is needed; this is for Enquire support in older browsers.
// 	{
// 		test: window.matchMedia,
// 		nope: template_path + "js/media.match.min.js"
// 	},

// 	// Touch devices get enhanced touch support.
// 	{
// 		test: Modernizr.touch,
// 		yep: [ template_path + "js/doubletaptogo.min.js", template_path + "js/fastclick.js" ],
// 		complete: function() {

// 			//For touch devices
// 			if ( Modernizr.touch ) {
// 				// Hide top panel on mobile devices.
// 				window.scrollTo(0, 1);

// 				//Activate double tap to go for dropdown menus
// 				$(".nav.navbar-nav li:has(ul)").doubleTapToGo();

// 				//Activate fastclick.js (https://github.com/ftlabs/fastclick)
// 				FastClick.attach(document.body);
// 			}

// 		}
// 	},

// 	// Load Enquire.js
// 	{
// 		load: template_path + "js/enquire.min.js",
// 		complete: function() {

// 			// Set up enquire

// 		}
// 	}

// ]);

}(jQuery));
