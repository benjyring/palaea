var myPop,
wherePops = [],
popCount = (platesArray.filter(plate => plate.inland === true && plate.z > 0 && plate.z < 4 && plate.m > 1).length) * 4,
max = 10;

function Pop(population,supplies,strength,location,territory,friendlyPops,hostilePops){
	this.population = population;
	this.supplies = supplies;
	this.strength = strength;
	this.location = location;
	this.territory = territory;
	this.friendlyPops = friendlyPops;
	this.hostilePops = hostilePops;
}

//
// Movement
//
function stock(key, amount){
	key = amount;
}

function whereTo(pop, modX, modY){
	return getCellByXY((pop.location.x + (modX)), (pop.location.y + (modY)));
}

function move(pop, endCell){
	var dx = diffXY(pop.location, endCell).x,
		dy = diffXY(pop.location, endCell).y;

	if ((dx + dy) > max){
		alert('Can\'t move ' + (dx + dy) + ' cells in one turn.');
	} else {
		if (inaccessible.includes(endCell.env.type)){
			alert('Can\'t rest on a ' + endCell.env.type + 'cell');
		} else {
			pop.location = endCell;
		}
	}

	mapVis(zoom*sideLen);
}

//
// AI
//
function nearestOfEnv(currentCell, envType){
	var desiredCells = cellArray.filter(cell => cell.env.type === envType);

	var distances = desiredCells.map(dCell => {
		var dx = diffXY(myPop.location, dCell).diffX,
			dy = diffXY(myPop.location, dCell).diffY,
			distance = dx + dy,
			cellI = (dCell.y-1)*totalX + (dCell.x-1);

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
function generatePops(numberOfPops, callback){
	var inhabitableCells = cellArray.filter(cell => cell.inland === true && cell.z > 0 && cell.z < 4 && cell.m > 1);

	for (var i = 0; i < numberOfPops; i++){
		popArray.push(
			new Pop(
				rand(paleolithic.minGroupSize, paleolithic.maxGroupSize),
				{
					water: max,
					food: max
				},
				{
					health: max,
					morale: max
				},
				inhabitableCells[rand(1, inhabitableCells.length)],
				[],
				[],
				[]
			)
		);
	}

	callback();
}

function addToWherePops(callback){
	for (i = 0; i < popArray.length; i++){
		for (n = 0; n < popArray[i].location.length; n++){
			wherePops.push(popArray[i].location[n]);
		}
	}

	callback();
}

// =============================
// Create Populations on the map
// =============================

generatePops(popCount, function(){
	// addToWherePops(function(){
		// Temporarily set myPop to random among pops
		// Eventually, will create new pop for each joined player,
		// and remove a pop from the earlier array
		myPop = popArray[rand(0, popArray.length)];
		myPop.myPop = true;
	// });
});
