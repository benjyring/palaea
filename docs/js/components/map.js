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

function zmod(currentCell,raiseBy,degreeOfVariation){
	var existingZ = currentCell.z,
	newZ = rand((raiseBy + existingZ), (raiseBy*Math.abs(degreeOfVariation)));
	currentCell.z = newZ;
}

function modifySurroundingZ(e){
	var cellTo1N = cellArray.filter(cell => cell.x == e.x && cell.y == (e.y - 1))[0],
	cellTo1E = cellArray.filter(cell => cell.x == (e.x + 1) && cell.y == e.y)[0],
	cellTo1S = cellArray.filter(cell => cell.x == e.x && cell.y == (e.y + 1))[0],
	cellTo1W = cellArray.filter(cell => cell.x == (e.x - 1) && cell.y == e.y)[0],
	cellTo2N = cellArray.filter(cell => cell.x == e.x && cell.y == (e.y - 2))[0],
	cellTo2E = cellArray.filter(cell => cell.x == (e.x + 2) && cell.y == e.y)[0],
	cellTo2S = cellArray.filter(cell => cell.x == e.x && cell.y == (e.y + 2))[0],
	cellTo2W = cellArray.filter(cell => cell.x == (e.x - 2) && cell.y == e.y)[0],
	cellAway1 = [cellto1N, cellto1E, cellto1S, cellto1W],
	cellAway2 = [cellto2N, cellto2E, cellto2S, cellto2W];

	for (i=0; i < cellAway1.length; i++){
		var difference = e.z - cellAway2[i].z;
		zmod(cellAway1[i], 2, difference);
	}
}

function mapCell(x,y,z,border,continent,level,texture){
	this.x = x;
	this.y = y;
	this.z = z;
	this.border = border;
	this.continent = continent;
	this.level = level;
	this.texture = texture;
	this.className = "cell";
}

function mapGrid(rows, cols){
	for (var r = 0; r < rows; ++r){
		for (var c = 0; c < cols; ++c){
			var newMapCell = new mapCell(c+1, r+1, rand(1,3), false);
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
	for (var c = 0; c < continentsArray.length; c++){
		continentsArray[c].force = rand(1,10);
		continentsArray[c].direction = rand(1,4);
	}

	for (var i = 0; i < cellArray.length; i++){
		var currentCellX = cellArray[i].x,
		currentCellY = cellArray[i].y,
		currentCell = cellArray[i],
		contCurrent = continentsArray[parseInt(currentCell.continent) - 1],
		ccd = contCurrent.direction,
		cellToE, contNextE, ced, cef,
		cellToS, contNextS, csd, csf;

		if (cellArray.filter(cell => cell.x == currentCellX+1 && cell.y == currentCellY)[0]){
			var cellToE = cellArray.filter(cell => cell.x == currentCellX+1 && cell.y == currentCellY)[0],
			contNextE = continentsArray[parseInt(cellToE.continent) - 1],
			ced = contNextE.direction,
			cef = contNextE.force;
		}

		if (cellArray.filter(cell => cell.x == currentCellX && cell.y == currentCellY+1)){
			var cellToS = cellArray.filter(cell => cell.x == currentCellX && cell.y == currentCellY+1)[0],
			contNextS = continentsArray[parseInt(cellToS.continent) - 1],
			csd = contNextS.direction,
			csf = contNextS.force;
		}

		if (cellToE != null){
			if (ccd != ced){
				// Checking only the cell to the east
				if (!isOdd(ccd) && !isOdd(ced)){
					if (ccd < ced){
						// Mountain
						zmod(currentCell,2,cef+csf);
						zmod(cellToE,2,cef+csf);
					} else {
						// Canyon
						zmod(currentCell,-2,cef+csf);
						zmod(cellToE,-2,cef+csf);
					}
				} else if ((!isOdd(ccd) && isOdd(ced)) || (isOdd(ccd) && !isOdd(ced)) ) {
					if (ccd < ced){
						// Hill
						zmod(currentCell,1,cef+csf);
						zmod(cellToE,1,cef+csf);
					} else {
						// Valley
						zmod(currentCell,-1,cef+csf);
						zmod(cellToE,-1,cef+csf);
					}
				}
				currentCell.border = true;
			}
		}
		if (cellToS != null){
			if (ccd != csd){
				// Checking only the cell to the south
				if (isOdd(ccd) && isOdd(csd)){
					if (ccd > csd){
						// Mountain
						zmod(currentCell,2,cef+csf);
						zmod(cellToE,2,cef+csf);
					} else {
						// Canyon
						zmod(currentCell,-2,cef+csf);
						zmod(cellToE,-2,cef+csf);
					}
				} else if ((!isOdd(ccd) && isOdd(csd)) || (isOdd(ccd) && !isOdd(csd)) ) {
					if (ccd > csd){
						// Hill
						zmod(currentCell,1,cef+csf);
						zmod(cellToE,1,cef+csf);
					} else {
						// Valley
						zmod(currentCell,-1,cef+csf);
						zmod(cellToE,-1,cef+csf);
					}
				}
				currentCell.border = true;
			}
		}
	}
}
function landTexture(){
	for (var i = 0; i < cellArray.length; i++){
		modifySurroundingZ(cellArray[i]);
	}
	for (var c = 0; c < continentsArray.length; c++){
		zmod(continentsArray[c], 1, 2);
		modifySurroundingZ(continentsArray[c]);
	}
}

// // BUILD THE WORLD
mapGrid(totalY, totalX);
createContinents(rand(12, 24));
pathFinder();
plateGeography();
landTexture();

// TO DO
// 1. Randomly decide main-point mapCells WITHIN a margin from map edges (maybe.)
// 2. On edges of adjacent chunks, create mountain ranges with z