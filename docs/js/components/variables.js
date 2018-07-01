// ===========
// COMPLETIONS
// ===========
var mapGridCompleted = false,
	createPlatesCompleted = false,
	pathFinderCompleted = false,
	plateGeographyCompleted = false,
	mapBorderPlatesCompleted = false,
	landTextureCompleted = false,
	makeIslandsCompleted = false
	displayGridCompleted = false,
	displayPopsCompleted = false;

// =====
// WORLD
// =====

const totalX = 130,
totalY = 80;

var cellArray = [],
platesArray = [];


// ===========
// POPULATIONS
// ===========

var popArray = [],
paleolithic = {
	minGroupSize: 20,
	maxGroupSize: 50
},
neolithic = {
	minGroupSize: 50,
	maxGroupSize: 100
};
