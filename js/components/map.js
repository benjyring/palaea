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

function isEmpty(data){
	if(typeof(data) == 'number' || typeof(data) == 'boolean'){
		return false;
	}
	if(typeof(data) == 'undefined' || data === null){
		return true;
	}
	if(typeof(data.length) != 'undefined'){
		return data.length == 0;
	}
	var count = 0;
	for(var i in data){
		if(data.hasOwnProperty(i)){
			count ++;
		}
	}
	return count == 0;
}

function findOnce(arr1, arr2){
	return arr1.some(r=> arr2.includes(r));
}

function getCellByXY(elX, elY){
	return cellArray.filter(cell => cell.x == elX && cell.y == elY)[0];
}

function checkPlus(el){
	// Returns an array of the "plus" shape of cells surrounding the passed cell.
	// Ordered North, East, South, West
	return [getCellByXY(el.x, el.y - 1), getCellByXY(el.x + 1, el.y), getCellByXY(el.x, el.y + 1), getCellByXY(el.x - 1, el.y)];
}

function zmod(currentCell,raiseBy,degreeOfVariation){
	var existingZ = currentCell.z,
	newZ = rand((raiseBy + existingZ), (raiseBy*Math.abs(degreeOfVariation)));
	currentCell.z = newZ;
}

function mMod(currentCell,raiseBy,degreeOfVariation){
	var existingm = currentCell.m,
	newm = rand((raiseBy + existingm), (raiseBy*Math.abs(degreeOfVariation)));
	currentCell.m = newm;
}

function modifySurroundingZ(el){
	var cellTo1N = getCellByXY(el.x, (el.y - 1)),
	cellTo1E = getCellByXY((el.x + 1), el.y),
	cellTo1S = getCellByXY(el.x, (el.y + 1)),
	cellTo1W = getCellByXY((el.x - 1), el.y),
	cellTo2N = getCellByXY(el.x, (el.y - 2)),
	cellTo2E = getCellByXY((el.x + 2), el.y),
	cellTo2S = getCellByXY(el.x, (el.y + 2)),
	cellTo2W = getCellByXY((el.x - 2), el.y),
	cellAway1 = [cellto1N, cellto1E, cellto1S, cellto1W],
	cellAway2 = [cellto2N, cellto2E, cellto2S, cellto2W];

	for (i = 0; i < cellAway1.length; i++){
		var difference = el.z - cellAway2[i].z;
		zmod(cellAway1[i], 2, difference);
	}
}

function mapCell(x,y,z,m,inland,continent,continentBorder,mapBorder){
	this.x = x;
	this.y = y;
	this.z = z;
	this.m = m;
	this.inland = inland || false;
	this.continent = continent;
	this.continentBorder = continentBorder || false;
	this.mapBorder = mapBorder || false;
}

function mapGrid(rows, cols, callback){
	for (var r = 0; r < rows; ++r){
		for (var c = 0; c < cols; ++c){
			cellArray.push(
				new mapCell(c+1, r+1, rand(1,3))
			);
		}
	}
	callback();
}

function createContinents(numberOfContinents, callback){
	for (var c = 0; c < numberOfContinents; c++){
		var randX = rand(1, totalX),
		randY = rand(1, totalY),
		continentNumber = (c+1),
		rXrY = getCellByXY(randX, randY);

		rXrY.continent = continentNumber;
		continentsArray.push(rXrY);
	}
	callback();
}

function pathFinder(callback){
	for (var i = 0; i < cellArray.length; i++){
		var paths = [],
		pathsObj = {};

		for (var c = 0; c < continentsArray.length; c++){
			var diffX = Math.abs(continentsArray[c].x - cellArray[i].x),
			diffY = Math.abs(continentsArray[c].y - cellArray[i].y);

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
	callback();
}

function plateGeography(callback){
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

		if (getCellByXY(currentCellX+1, currentCellY)){
			var cellToE = getCellByXY(currentCellX+1, currentCellY),
			contNextE = continentsArray[parseInt(cellToE.continent) - 1],
			ced = contNextE.direction,
			cef = contNextE.force;
		}

		if (getCellByXY(currentCellX+1, currentCellY)){
			var cellToS = getCellByXY(currentCellX+1, currentCellY),
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
				currentCell.continentBorder = true;
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
				currentCell.continentBorder = true;
			}
		}
	}
	callback();
}

	}
	callback();
}

function mapBorderContinents(callback){
	var mapBorderCells = cellArray.filter(cell => [1, totalX].indexOf(cell.x) > -1 || [1, totalY].indexOf(cell.y) > -1);

	for (var c = 1; c <= continentsArray.length; c++){
		var cellsInThisContinent = cellArray.filter(cell => cell.continent == c);

		if (findOnce(cellsInThisContinent, mapBorderCells)){
			if (!isEmpty(continentsArray[c])){
				continentsArray[c].mapBorder = true;
function landTexture(callback){
	for (n = 0; n < cellArray.length; n++){
		let i = cellArray[n];

		if (i.plate > (platesArray.length / 2) || platesArray[i.plate].mapBorder == true){
			// SEA
			i.inland = false;

			if (i.plateBorder != true){
				i.z = 0;
				i.m = 3;
			} else {
				if (i.z >= 20){
					// Island Centers
					if (i.z < 32) {
						i.z = Math.ceil(((i.z - 6)/8) * 1);
						i.m = Math.ceil(((i.z - 6)/5) * 1);
					} else {
						i.z = 4;
						i.m = 6;
					}
				} else {
					if (i.z > 5){
						// Reefs
						i.m = 2;
						i.z = 0;
					} else {
						// This creates texture in reefs,
						// to break up some long archipelegos
						i.m = 3;
						i.z = 0;
					}
				}
			}
		} else {
			// LAND
			i.inland = true;
			i.m = 1;

			if (i.z > 0 && i.z < 5){
				i.z = 1;
				// moisture will be determined by an average of distance from water and distance from mountain (z<20)
			} else if (i.z >= 5 && i.z < 10){
				i.z = 2;
			} else if (i.z >= 10 && i.z <= 15){
				i.z = 3;
			} else if (i.z >= 15 && i.z < 20){
				i.z = 4;
				i.m = rand(1, 3);
			} else if (i.z >= 20){
				i.z = 4;
				i.m = rand(4, 6);
			} else {
				i.z = 0;
			}
		}
	}
	callback();
}

function makeIslands(callback){
	var islands = cellArray.filter(cell => cell.inland == false && cell.m > 3);

	for (n = 0; n < islands.length; n++) {
		var island = checkPlus(islands[n]);

		for (i = 0; i < island.length; i++){
			if (island[i].z < 4){
				island[i].z=1;
			}
		}
		islands[n].z = 3;
	}

	callback();
}


// BUILD THE WORLD
mapGrid(totalY, totalX, function(){
	createContinents(rand(24, 48), function(){
		pathFinder(function(){
			plateGeography(function(){
				// _Build Map
				mapBorderPlates(function(){
					landTexture(function(){});
					makeIslands(function(){});
				});
			});
		});
	});
});
