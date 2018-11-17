function Pop(type,species,population,supplies,strength,cell,tile,territory,ap,turn){
	this.type = type;
	this.species = species;
	this.population = population;
	this.supplies = supplies;
	this.strength = strength;
	this.cell = cell;
	this.tile = tile;
	this.territory = territory;
	this.ap = ap || app.max;
	this.turn = turn;
}

//
// Movement
//
function whereTo(pop, modX, modY){
	return getCellByXY((pop.cell.x + (modX)), (pop.cell.y + (modY)));
}

function move(pop, endCell){
	var playerAlert,
		dx = diffXY(pop.cell, endCell).x,
		dy = diffXY(pop.cell, endCell).y;;

	if ((dx + dy) > pop.ap){
		playerAlert = 'Not enough AP to move ' + (dx + dy) + ' cells.';
	} else {
		if (app.inaccessible.includes(endCell.env.type)){
			playerAlert = 'Can\'t rest on a ' + endCell.env.type + ' cell.';
		} else {
			pop.cell = endCell;
			pop.ap = pop.ap - 1;

			if (pop.ap === 0){
				playerAlert = 'Turn complete.';
				pop.turn = pop.turn + 1;
				app.game.turn += 1;
				pop.ap = app.max;
			}
		}
	}

	mapVis(app.viewport.zoom);

	if (pop === app.myPop){
		updateUI(pop);

		if (!isEmpty(playerAlert)){
			alert(playerAlert);
		}
	}
}

//
// AI
//
function nearestOfEnv(currentCell, envType){
	var desiredCells = app.cellArray.filter(cell => cell.env.type === envType);

	var distances = desiredCells.map(dCell => {
		var dx = diffXY(currentCell, dCell).x,
			dy = diffXY(currentCell, dCell).x,
			distance = dx + dy,
			cellI = (dCell.y-1)*app.totalX + (dCell.x-1);

		return {
			cellI: cellI,
			distance: distance
		};
	});

	var shortest = Math.min(...distances.map(function(i){return i.distance})),
		closest = distances.filter(d => d.distance === shortest);

	return closest[rand(0, closest.length-1)];
}

//
// Generation
//
function generatePops(callback){
	var inhabitableCells = app.cellArray.filter(cell => !app.inaccessible.includes(cell.env.type));

	for (var i = 0; i < app.popCount; i++){
		var type;

		if ((i != 0) && (i % 7 === 0)){
			type = 'carnivore';
		} else {
			type = 'herbivore';
		}

		app.popArray.push(
			new Pop(
				type,
				undefined,
				rand(paleolithic.minGroupSize, paleolithic.maxGroupSize),
				{
					water: app.max,
					food: app.max
				},
				{
					health: app.max,
					morale: app.max
				},
				inhabitableCells[rand(1, inhabitableCells.length)],
				{
					x: undefined,
					y: undefined
				},
				[],
				app.max,
				1
			)
		);
	}

	callback();
}

function setMyPop(callback){
	// Temporarily set myPop to random among pops
	app.myPop = app.popArray[rand(0, (app.popCount-1))];
	app.myPop.species = 'human';
	app.myPop.type = 'human';

	if (callback){
		callback();
	}
}