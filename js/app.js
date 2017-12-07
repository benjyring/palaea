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

	//FLEXSLIDER
	$(window).on('load', function() {
		$('.flexslider').flexslider({
			animation: "slide",
			directionNav: false,
			controlNav: true,
		});
	});
	$(window).on('load', function() {
		$(function() {
			var pull = $('#pull');
			var menu = $('nav ul');

			$(pull).on('click', function(e) {
				e.preventDefault();
				menu.slideToggle();
			});
		});
		$(window).resize(function() {
			var menu = $('nav ul');
			var w = $(window).width();
			if (w > 320 && menu.is(':hidden')) {
				menu.removeAttr('style');
			}
		});
	});


	//OVERLAYS
	$(document).ready(function() {
		if (Modernizr.touch) {
			// show the close overlay button
			$(".close-overlay").removeClass("hidden");
			// handle the adding of hover class when clicked
			$(".effects .img").click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				if (!$(this).hasClass("hover")) {
					$(this).addClass("hover");
				}
			});
			// handle the closing of the overlay
			$(".close-overlay").click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				if ($(this).closest(".img").hasClass("hover")) {
					$(this).closest(".img").removeClass("hover");
				}
			});
		} else {
			// handle the mouseenter functionality
			$(".effects .img").mouseenter(function() {
				$(this).addClass("hover");
			})
			// handle the mouseleave functionality
			.mouseleave(function() {
				$(this).removeClass("hover");
			});
		}
	});


	// SMOOTH NAV SCROLL
	$(function() {
		$('a[href*=#]:not([href=#])').click(function() {
			if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {

				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
				if (target.length) {
					$('html,body').animate({
						scrollTop: target.offset().top
					}, 2000);
					return false;
				}
			}
		});
	});


	// WAYPOINTS
	$(function() {
		$('.wp1').waypoint(function() {
			$('.wp1').addClass('animated bounceInLeft');
		}, {
			offset: '85%'
		});

		$('.wp2').waypoint(function() {
			$('.wp2').addClass('animated bounceInRight');
		}, {
			offset: '85%'
		});

		$('.wp3').waypoint(function() {
			$('.wp3').addClass('animated bounceInLeft');
		}, {
			offset: '85%'
		});

		$('.wp4').waypoint(function() {
			$('.wp4').addClass('animated fadeInUp');
		}, {
			offset: '85%'
		});

		$('.wp5').waypoint(function() {
			$('.wp5').addClass('animated fadeInUp');
		}, {
			offset: '85%'
		});

		$('.wp6').waypoint(function() {
			$('.wp6').addClass('animated fadeInUp');
		}, {
			offset: '85%'
		});
	});

	// FULLSCREEN
	$(function() {
		$('.fullscreen-open').click(function(){
			$(this).parent().parent().parent().addClass('fullscreen');
		});
		$('.close').click(function(){
			$('.fullscreen').removeClass('fullscreen');
		});
	});

	// Google Analytics tracking clicks
	trackClicks();

});

// If you need to load or unload things based on the current media query, use Enquire:
// http://wicky.nillia.ms/enquire.js
Modernizr.on('load', [

	// Test for placeholder support, IE8 and IE9 doesn't support input placeholders, target it with '.placeholder' and other normal ways to style placeholders.
	{
		test: Modernizr.placeholder,
		nope: template_path + "js/jquery.placeholder.js",
		complete: function() {

			if ( ! Modernizr.placeholder ) {
				$('input[placeholder]').placeholder();
			}

		}
	},

	// Test if polyfill is needed; this is for Enquire support in older browsers.
	{
		test: window.matchMedia,
		nope: template_path + "js/media.match.min.js"
	},

	// Touch devices get enhanced touch support.
	{
		test: Modernizr.touch,
		yep: [ template_path + "js/doubletaptogo.min.js", template_path + "js/fastclick.js" ],
		complete: function() {

			//For touch devices
			if ( Modernizr.touch ) {
				// Hide top panel on mobile devices.
				window.scrollTo(0, 1);

				//Activate double tap to go for dropdown menus
				$(".nav.navbar-nav li:has(ul)").doubleTapToGo();

				//Activate fastclick.js (https://github.com/ftlabs/fastclick)
				FastClick.attach(document.body);
			}

		}
	},

	// Load Enquire.js
	{
		load: template_path + "js/enquire.min.js",
		complete: function() {

			// Set up enquire

		}
	}

]);

}(jQuery));
