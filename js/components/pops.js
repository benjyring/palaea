var popCount = platesArray.filter(plate => plate.inland === true && plate.z > 0 && plate.z < 4 && plate.m > 1).length;

function Pop(population, occupying, territory, water, food, rest, friendlyPops, hostilePops){
	this.population = population;
	this.occupying = occupying;
	this.territory = territory;
	this.water = water;
	this.food = food;
	this.rest = rest;
	this.friendlyPops = friendlyPops;
	this.hostilePops = hostilePops;
}

function generatePops(numberOfPops, callback){
	var inhabitableCells = cellArray.filter(cell => cell.inland === true && cell.z > 0 && cell.z < 4 && cell.m > 1);

	for (var i = 0; i < numberOfPops; i++){
		popArray.push(
			new Pop(
				rand(paleolithic.minGroupSize, paleolithic.maxGroupSize),
				inhabitableCells[rand(1, inhabitableCells.length)],
				0,0,0,0,[],[]
			)
		);
	}

	callback();
}

generatePops(popCount, function(){});
