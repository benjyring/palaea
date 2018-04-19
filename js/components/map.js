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

function zmod(currentCell,raiseBy,degreeOfVariation){
	var existingZ = currentCell.z,
	newZ = rand((raiseBy + existingZ), (raiseBy*Math.abs(degreeOfVariation)));
	currentCell.z = newZ;
}

function moistureMod(currentCell,raiseBy,degreeOfVariation){
	var existingMoisture = currentCell.moisture,
	newMoisture = rand((raiseBy + existingMoisture), (raiseBy*Math.abs(degreeOfVariation)));
	currentCell.moisture = newMoisture;
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

function mapCell(x,y,z,continentBorder,continent,level,moisture,inland,mapBorder){
	this.x = x;
	this.y = y;
	this.z = z;
	this.continentBorder = continentBorder;
	this.continent = continent;
	this.level = level;
	this.moisture = moisture;
	this.inland = inland;
	this.mapBorder = mapBorder || false;
}

function mapGrid(rows, cols, callback){
	for (var r = 0; r < rows; ++r){
		for (var c = 0; c < cols; ++c){
			var newMapCell = new mapCell(c+1, r+1, rand(1,3), false);
			cellArray.push(newMapCell);
		}
	}
	callback();
}

function createContinents(numberOfContinents, callback){
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

function landTexture(callback){
	for (var i = 0; i < cellArray.length; i++){
		modifySurroundingZ(cellArray[i]);
	}
	for (var c = 0; c < continentsArray.length; c++){
		zmod(continentsArray[c], 1, 2);
		modifySurroundingZ(continentsArray[c]);
	}
	callback();
}

function mapBorderContinents(callback){
	var mapBorderCells = cellArray.filter(cell => [1, totalX].indexOf(cell.x) > -1 || [1, totalY].indexOf(cell.y) > -1);

	for (var c = 1; c <= continentsArray.length; c++){
		var cellsInThisContinent = cellArray.filter(cell => cell.continent == c);

		if (findOnce(cellsInThisContinent, mapBorderCells)){
			continentsArray[c].mapBorder = true;
		}
	}
	callback();
}

// BUILD THE WORLD
mapGrid(totalY, totalX, function(){
	createContinents(rand(24, 48), function(){
		pathFinder(function(){
			plateGeography(function(){
				landTexture();
			});
		});
	});
});
