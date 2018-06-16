var myPop,
wherePops = [],
popTerritories = [],
popCount = platesArray.filter(plate => plate.inland === true && plate.z > 0 && plate.z < 4 && plate.m > 1).length;

function Pop(population,supplies,health,water,food,morale,occupying,territory,friendlyPops,hostilePops){
	this.population = population;
	this.supplies = supplies;
	this.health = health;
	this.water = water;
	this.food = food;
	this.morale = morale;
	this.occupying = occupying;
	this.territory = territory;
	this.friendlyPops = friendlyPops;
	this.hostilePops = hostilePops;
}

function generatePops(numberOfPops, callback){
	var inhabitableCells = cellArray.filter(cell => cell.inland === true && cell.z > 0 && cell.z < 4 && cell.m > 1);

	for (var i = 0; i < numberOfPops; i++){
		popArray.push(
			new Pop(
				rand(paleolithic.minGroupSize, paleolithic.maxGroupSize),
				10,
				10,
				10,
				10,
				4,
				[inhabitableCells[rand(1, inhabitableCells.length)]],
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
		for (n = 0; n < popArray[i].occupying.length; n++){
			wherePops.push(popArray[i].occupying[n]);
		}
	}

	callback();
}

// =============================
// Create Populations on the map
// =============================

generatePops(popCount, function(){
	addToWherePops(function(){
		// Temporarily set myPop to random among pops
		// Eventually, will create new pop for each joined player,
		// and remove a pop from the earlier array
		myPop = popArray[rand(0, popArray.length)];
	});
});
