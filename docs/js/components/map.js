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

function mapCell(x,y,z,continent){
	this.x = x;
	this.y = y;
	this.z = z || rand(1, 3);
	this.continent = continent;
	this.className = "cell";
}

function mapGrid(rows, cols){
	for (var r = 0; r < rows; ++r){
		for (var c = 0; c < cols; ++c){
			var newMapCell = new mapCell(c+1, r+1, rand(1,3));
			cellArray.push(newMapCell);
		}
	}
}

function createContinents(numberOfContinents){
	for (var i = 0; i < numberOfContinents; i++){
		var randX = rand(1, totalX),
		randY = rand(1, totalY),
		continentNumber = (i+1),
		rXrYArray = cellArray.filter(function(cell){
			return cell.x === randX && cell.y === randY;
		}),
		rXrY = rXrYArray[0];

		rXrY.continent = continentNumber;
		continentsArray.push(rXrY);
	}
}

function pathFinder(){
	for (var i = 0; i < cellArray.length; i++){
		var currentCellX = cellArray[i].x,
		currentCellY = cellArray[i].y,
		paths = [],
		pathsObj = {};

		for (var c = 0; c < continentsArray.length; c++){
			var diffX = Math.abs(continentsArray[c].x - currentCellX),
			diffY = Math.abs(continentsArray[c].y - currentCellY);

			paths.push((diffX + diffY) + ':' + continentsArray[c].continent.toString());
		}

		for (var d = 0; d < paths.length; d++) {
			var split = paths[d].split(':');

			pathsObj[split[0].trim()] = split[1].trim();
		}

		var min = Object.keys(pathsObj).min(),
		shortest = pathsObj[min];

		cellArray[i].continent = shortest;
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


// // BUILD THE WORLD
mapGrid(totalY, totalX);
createContinents(rand(6, 12));
pathFinder();
// plateGeography();


// TO DO
// 1. Randomly decide main-point mapCells WITHIN a margin from map edges (maybe.)
// 2. On edges of adjacent chunks, create mountain ranges with z