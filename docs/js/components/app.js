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
	// 1. Visualize Map
	// ======================
	///////////////////////////////
	var map = $('#map');
	// 1. Visualize Map
	$('button#buildMap').click(function(){
		if (!map.find('.cell').length){
			// Create grid
			$.each(cellArray, function(index, i) {
				var levelClass;
				if (i.z < 0){
					levelClass = "belowSeaLevel";
				} else if (i.z >= 25 ){
					levelClass = "aboveSnowLevel";
				} else {
					levelClass = "normal";
				}
				map.append('<div class="' + i.className + ' ' + levelClass + '" data-x="' + i.x + '" data-y="' + i.y + '" data-z="' + i.z + '" data-continent="' + i.continent + '"></div>');
			});
			// Visualize continents
			$.each(continentsArray, function(index, i) {
				$('.cell[data-x=' + i.x + '][data-y=' + i.y + ']').attr('id', 'continent-' + i.continent)
				.attr('force', i.force)
				.attr('direction', i.direction);
			});
		} else {
			alert('Map is already generated.');
		}
		$('.cell').promise().done(function(){
			$('#splashscreen').remove();
		});
	});

	// var cell = $('.cell');

	// // _Visualize Sea Level
	// cell.each(function(){
	// 	if (parseInt(cell.data('z')) < 1){
	// 		$(this).addClass('belowSeaLevel');
	// 	}
	// });

	// 2. UI
	// Colors
	$('#colorPalette').click(function(){
		$('#colors').toggleClass('visible');
	});
	// Zoom
	var getZoom = function(){
		parseInt(map.data('zoom'));
	};
	var setZoom = function(n){
		map.attr('data-zoom', n);
	};

	$('#zoomIn').click(function(){
		if (getZoom() < 3) {
			setZoom(getZoom()+1);
		}
	});
	$('#zoomOut').click(function(){
		if (getZoom() > -3) {
			setZoom(getZoom()-1);
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
