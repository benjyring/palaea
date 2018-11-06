var app = new Object,
game,
maxZoom = 16,
zoom = 1,
sideLen = 4,
twoWeeks = 14,
maxTurns = 365;

// ===========
// COMPLETIONS
// ===========
app.mapGridCompleted = false;
app.createPlatesCompleted = false;
app.pathFinderCompleted = false;
app.plateGeographyCompleted = false;
app.mapBorderPlatesCompleted = false;
app.landTextureCompleted = false;
app.makeIslandsCompleted = false;
app.displayGridCompleted = false;
app.displayPopsCompleted = false;
app.minimizeCellDataCompleted = false;

// =====
// WORLD
// =====

app.totalX = 130;
app.totalY = 80;

var cellArray = [],
	platesArray = [];

app.environmentArray = {
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
		type: 'river'
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
		type: 'deciduousforest'
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
		type: 'snow'
	},
	env43: {
		color: '#aa622e',
		type: 'snow'
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
};

// Temporary: must create Tundra environment type
// 42 and 43 should be TUNDRA

app.inaccessible = ['ocean', 'sea', 'river', 'rocky', 'snow'];
// inaccessible will change based on milestones

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
