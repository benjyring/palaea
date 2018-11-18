var app = new Object;

// ========
// VIEWPORT
// ========
app.viewport = new Object;
app.viewport.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
app.viewport.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
app.viewport.view = 'cell';
app.viewport.zoom = 1;
app.viewport.maxZoom = 16;

app.viewport._offset = new Object;
app.viewport._offset.x = 0;
app.viewport._offset.y = 0;
app.viewport._offset.startX = app.viewport._offset.x;
app.viewport._offset.startY = app.viewport._offset.y;

app.mouse = new Object;
app.mouse.down = false;

app.game = new Object;
app.sideLen = 8;

// =====
// INNER
// =====
app.inner = new Object;

app.inner.animate = undefined;
app.inner.fps = 60;
app.inner.moveBy = 5;
app.inner.sideLen = 64;

app.gameArea = new Object;
app.gameArea.offsetX = 0;
app.gameArea.offsetY = 0;
app.gameArea.draw = function(){
	drawTiles(app.inner.sideLen);
	drawChar(app.inner.sideLen/2);
};
app.gameArea.listen = function(){
	window.addEventListener('keydown', function(e){
		app.gameArea.keys = (app.gameArea.keys || []);
		app.gameArea.keys[e.keyCode] = (e.type == "keydown");
	});
	window.addEventListener('keyup', function(e){
		app.gameArea.keys[e.keyCode] = (e.type == "keydown");
	});
};
app.gameArea.clear = function(){
	app.innerCtx.clearRect(0, 0, app.innerMap.width, app.innerMap.height);
};

// ===========
// COMPLETIONS
// ===========
app.completed = new Object;
app.completed.mapGrid = false;
app.completed.createPlates = false;
app.completed.pathFinder = false;
app.completed.plateGeography = false;
app.completed.mapBorderPlates = false;
app.completed.landTexture = false;
app.completed.makeIslands = false;
app.completed.displayGrid = false;
app.completed.displayPops = false;
app.completed.minimizeCellData = false;

// =====
// WORLD
// =====

app.totalX = 130;
app.totalY = 80;

app.cellArray = [];
app.platesArray = [];

app.environmentArray = {
	env03: {
		color: '#0b0a32',
		density: 0,
		// fruitfulness: 1,
		// smallGame: 'ocean-fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'ocean'
	},
	env02: {
		color: '#1f3078',
		density: 1,
		// fruitfulness: 1,
		// smallGame: 'sea-fish',
		// largeGame: 'shark',
		// vegetation: 'seaweed',
		type: 'sea'
	},
	env01: {
		color: '#5078b3',
		density: 2,
		// fruitfulness: 1,
		// smallGame: 'river-fish',
		// largeGame: 'catfish',
		// vegetation: 'cattails',
		type: 'river'
	},
	env11: {
		color: '#eed19f',
		density: 0,
		// fruitfulness: 1,
		// smallGame: 'seagull',
		// largeGame: 'seal',
		// vegetation: 'shrub',
		type: 'beach'
	},
	env12: {
		color: '#6c6d36',
		density: 1,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'prairie'
	},
	env13: {
		color: '#2e421d',
		density: 7,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'thickforest'
	},
	env14: {
		color: '#2e421d',
		density: 7,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'thickforest'
	},
	env15: {
		color: '#214c25',
		density: 6,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'evergreenforest'
	},
	env16: {
		color: '#214c25',
		density: 6,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'evergreenforest'
	},
	env21: {
		color: '#efb08e',
		density: 3,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'shrubland'
	},
	env22: {
		color: '#6c6d36',
		density: 1,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'prairie'
	},
	env23: {
		color: '#6c6d36',
		density: 1,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'prairie'
	},
	env24: {
		color: '#34511d',
		density: 5,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'deciduousforest'
	},
	env25: {
		color: '#34511d',
		density: 5,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'deciduousforest'
	},
	env26: {
		color: '#3a5419',
		density: 5,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'deciduousforest'
	},
	env31: {
		color: '#efb08e',
		density: 3,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'shrubland'
	},
	env32: {
		color: '#efb08e',
		density: 3,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'shrubland'
	},
	env33: {
		color: '#506b2a',
		density: 4,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'lightforest'
	},
	env34: {
		color: '#506b2a',
		density: 4,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'lightforest'
	},
	env35: {
		color: '#557432',
		density: 5,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'rockyforest'
	},
	env36: {
		color: '#557432',
		density: 5,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'rockyforest'
	},
	env41: {
		color: '#bb9673',
		density: 4,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'rocky'
	},
	env42: {
		color: '#9f6e50',
		density: 2,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'snow'
	},
	env43: {
		color: '#aa622e',
		density: 2,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'snow'
	},
	env44: {
		color: '#ffffff',
		density: 2,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'snow'
	},
	env45: {
		color: '#ffffff',
		density: 2,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'snow'
	},
	env46: {
		color: '#ffffff',
		density: 2,
		// fruitfulness: 1,
		// smallGame: 'fish',
		// largeGame: 'whale',
		// vegetation: 'kelp',
		type: 'snow'
	}
};

// Temporary: must create Tundra environment type
// 42 and 43 should be TUNDRA

app.inaccessible = ['ocean', 'sea', 'river', 'rocky', 'snow'];
// inaccessible will change based on milestones


// ===========
// TECHNOLOGY
// ===========

// Stories:
// 1. User may wield an item by pressing an interaction key. This adds the item to the user's inventory, unless it is already full.
// 2. User may leave a fire to continue burning in a fireplace for up to four turns. During the process, wood will turn to char, which may be used for other things, until it has burnt out.
// 3. User may cook food in a fire. It must be removed after one turn, or it will burn to char.

// Recipes:
// 1. Stone + stone = burin + scraper
// 2. Burin + stone = awl + scraper
// 3. Scraper + stone = spearhead

app.tech = [
	{
		title: "Stone",
		desc: "",
		children: [
			{
				title: "End Scraper",
				type: "tool",
				desc: "An end scraper is a teardrop-shaped piece of stone. It can be used to scrape fur and fatty tissue from animal hides, and can be used to smooth wood or bones. End scrapers may also be attached to wooden handles for increased utility."
			},
			{
				title: "Burin",
				type: "tool",
				desc: "Burins are stone tools with a rounded grasping end and a sharp, razor-like working end. The tools are formed by striking off a small stone flake from a larger stone flake. Burins are used for carving other materials, such as bone and wood. They can be wielded in hand or attached to a wooden handle."
			},
			{
				title: "Awl",
				type: "tool",
				desc: "Awls are small, circular stone flakes with multiple sharp points around its circumference. These tools are useful for shredding and slicing fibers, for use as thread and fishing nets. The tool is also useful for punching holes in leather and wood, and cutting animal skins when making clothing."
			},
			{
				title: "Spearhead",
				type: "tool",
				desc: "A spearhead is leaf-shaped with a triangular point and a wide, grooved end, made to fit into a wooden shaft. They may be used for hunting. At a distance a spear can be launched at a large animal for safety. At close quarters, it may be used to lunge at prey."
			}
		]
	},
	{
		title: "Fire",
		desc: "",
		children: [
			{
				title: "Fire Pit",
				type: "workplace",
				desc: "It is possible to craft food, drink, and tools in new manner in a fire pit."
			},
		]
	},
	{
		title: "Pottery",
		desc: "",
		children: []
	},
	{
		title: "Agriculture",
		desc: "",
		children: []
	}
];

// ===========
// POPULATIONS
// ===========

app.popArray = [];

var paleolithic = {
	minGroupSize: 20,
	maxGroupSize: 50
};

var neolithic = {
	minGroupSize: 50,
	maxGroupSize: 100
};
