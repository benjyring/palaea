var totalX = 130,
totalY = 80,
cellArray = [],
continentsArray = [];

function isOdd(num) {
	return num % 2;
}

function rand(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

Array.prototype.min = function() {
	return Math.min.apply(null, this);
};

function zmod(element, raiseBy, degreeOfVariation){
	var existingZ = parseInt(element.getAttribute('data-z')),
	newZ = rand((raiseBy + existingZ), (raiseBy*Math.abs(degreeOfVariation)));
	element.setAttribute('data-z', parseInt(newZ));
}

// function seaLevel(z){
// 	if (z >= 0 && z < 8){
// 		return "above";
// 	}else if(z >= 8 ){
// 		return "snow";
// 	}else{
// 		return "below";
// 	}
// }

function mapCell(name,z){
// function mapCell(name,a,b,c,d,z){
	this.name = name;
	// this.a = a || rand(1, 2);
	// this.b = b || rand(1, 2);
	// this.c = c || rand(1, 2);
	// this.d = d || rand(1, 2);
	this.z = z || rand(1, 3);
}

function mapGrid( rows, cols ){
	var i = 0;
	var grid = document.getElementById('map');
	for (var r = 0; r < rows; ++r){
		var tr = grid.appendChild(document.createElement('tr'));
		for (var c = 0; c < cols; ++c){
			var newMapCell = new mapCell('X'+ (c+1) + '-Y' + (r+1));
			cellArray.push(newMapCell);

			var cell = tr.appendChild(document.createElement('td'));
			// cell.id = newMapCell.name;
			cell.dataset.x = c+1;
			cell.dataset.y = r+1;
			cell.dataset.z = rand(1, 3);
			cell.className = 'cell';
			// cell.className = 'cell t-' + newMapCell.a + ' r-' + newMapCell.b + ' b-' + newMapCell.c + ' l-' + newMapCell.d + ' z-' + newMapCell.z;
			// cell.innerHTML = '<span class="hidden">' + ++i + '</span>';
		}
	}
	return grid;
}

function createContinents(numberOfContinents){
	for (var i = 0; i < numberOfContinents; i++){
		var randX = rand(1, totalX),
		randY = rand(1, totalY),
		continentNumber = 'continent-' + (i+1),
		rXrY = document.querySelector("[data-x='" + randX + "'][data-y='" + randY + "']");
		rXrY.id = continentNumber;
	}
}

function pathFinder(){
	var cells = document.getElementsByClassName('cell'),
	continents = document.querySelectorAll('*[id^="continent"]');

	for (var i = 0; i < cells.length; i++){
		var currentCellX = cells[i].dataset.x,
		currentCellY = cells[i].dataset.y,
		paths = [];

		for (var c = 0; c < continents.length; c++){
			var diffX = Math.abs(continents[c].dataset.x - currentCellX);
			var diffY = Math.abs(continents[c].dataset.y - currentCellY);
			paths.push((diffX + diffY) + ':' + continents[c].id);
		}
		var pathsObj = {};
		for (var d = 0; d < paths.length; d++) {
			var split = paths[d].split(':');
			pathsObj[split[0].trim()] = split[1].trim();
		}
		var min = Object.keys(pathsObj).min();
		var shortest = pathsObj[min];
		cells[i].dataset.continent = shortest;
	}
}

function plateGeography(){
	var cells = document.getElementsByClassName('cell'),
	continents = document.querySelectorAll('*[id^="continent"]');

	for (var c = 0; c < continents.length; c++){
		continents[c].dataset.force = rand(1,10);
		continents[c].dataset.direction = rand(1,4);
	}

	for (var i = 0; i < cells.length; i++){
		var currentCellX = parseInt(cells[i].dataset.x),
		currentCellY = parseInt(cells[i].dataset.y),
		currentCell = cells[i];
		contCurrent = document.getElementById(cells[i].dataset.continent),
		ccd = contCurrent.dataset.direction,
		cellToE, contNextE, ced,
		cellToS, contNextS, csd;

		if (document.querySelector('[data-x="'+ (currentCellX+1) +'"][data-y="'+ (currentCellY) +'"]')){
			var cellToE = document.querySelector('[data-x="'+ (currentCellX+1) +'"][data-y="'+ (currentCellY) +'"]'),
			contNextE = document.getElementById(cellToE.dataset.continent),
			ced = contNextE.dataset.direction;
		}
		if (document.querySelector('[data-x="'+ currentCellX +'"][data-y="'+ (currentCellY+1) +'"]')){
			var cellToS = document.querySelector('[data-x="'+ currentCellX +'"][data-y="'+ (currentCellY+1) +'"]'),
			contNextS = document.getElementById(cellToS.dataset.continent),
			csd = contNextS.dataset.direction;
		}

		if (cellToE != null){
			if (ccd != ced){
				// Checking only the cell to the east
				if (!isOdd(ccd) && !isOdd(ced)){
					if (ccd < ced){
						// Mountain
						zmod(currentCell,2,2);
						zmod(cellToE,2,2);
					} else {
						// Canyon
						zmod(currentCell,-2,2);
						zmod(cellToE,-2,2);
					}
				} else if ((!isOdd(ccd) && isOdd(ced)) || (isOdd(ccd) && !isOdd(ced)) ) {
					if (ccd < ced){
						// Hill
						zmod(currentCell,1,2);
						zmod(cellToE,1,2);
					} else {
						// Valley
						zmod(currentCell,-1,2);
						zmod(cellToE,-1,2);
					}
				}
			}
		}
		if (cellToS != null){
			if (ccd != csd){
				// Checking only the cell to the south
				if (isOdd(ccd) && isOdd(csd)){
					if (ccd > csd){
						// Mountain
						zmod(currentCell,2,2);
						zmod(cellToE,2,2);
					} else {
						// Canyon
						zmod(currentCell,-2,2);
						zmod(cellToE,-2,2);
					}
				} else if ((!isOdd(ccd) && isOdd(csd)) || (isOdd(ccd) && !isOdd(csd)) ) {
					if (ccd > csd){
						// Hill
						zmod(currentCell,1,2);
						zmod(cellToE,1,2);
					} else {
						// Valley
						zmod(currentCell,-1,2);
						zmod(cellToE,-1,2);
					}
				}
			}
		}
	}
}


// BUILD THE WORLD
mapGrid(totalY, totalX);
createContinents(rand(6, 12));
pathFinder();
plateGeography();


// TO DO
// 1. Randomly decide main-point mapCells WITHIN a margin from map edges (maybe.)
// 2. On edges of adjacent chunks, create mountain ranges with z