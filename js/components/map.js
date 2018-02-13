
var totalX = 130,
totalY = 80,
cellArray = [];

function mapCell(name,a,b,c,d,z){
	this.name = name;
	this.a = a || rand(1, 2);
	this.b = b || rand(1, 2);
	this.c = c || rand(1, 2);
	this.d = d || rand(1, 2);
	// this.z = z || seaLevel(rand(-10, 10));
}

function rand(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

Array.prototype.min = function() {
	return Math.min.apply(null, this);
};

// function seaLevel(z){
// 	if (z >= 0 && z < 8){
// 		return "above";
// 	}else if(z >= 8 ){
// 		return "snow";
// 	}else{
// 		return "below";
// 	}
// }

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
			cell.className = 'cell t-' + newMapCell.a + ' r-' + newMapCell.b + ' b-' + newMapCell.c + ' l-' + newMapCell.d + ' z-' + newMapCell.z;
			cell.innerHTML = '<span class="hidden">' + ++i + '</span>';
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
			var diffX, diffY;
			if (continents[c].dataset.x >= currentCellX){
				var diffX = continents[c].dataset.x - currentCellX;
			} else {
				var diffX = currentCellX - continents[c].dataset.x;
			}
			if (continents[c].dataset.y >= currentCellY){
				var diffY = continents[c].dataset.y - currentCellY;
			} else {
				var diffY = currentCellY - continents[c].dataset.y;
			}
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


// BUILD THE WORLD
mapGrid(totalY, totalX);

createContinents(rand(2, 6));

pathFinder();


// TO DO
// for(var point of points) {
// 	for(var citizen of point.citizens) {
// 		//set color of cell based on point
// 		//draw cell at (point.x + citizen.dx) * cellSize, (point.y + citizen.dy) * cellSize
// 	}
// }
// 2. Make these lengths make visual sense
// if (previous row exists && while in row of Cells){
// 	currentCell.f.length = previousRowCellMinus1.c.length;
// 	currentCell.a.length = previousRowCell.d.length;
// 	currentCell.b.length = previousRowCellPlus1.e.length;
// }
// 3. Randomly decide main-point mapCells WITHIN a margin from map edges
// 4. Loop through mapCells, see which main point is closest
// 5. Make array of chunks
// 6. On edges of adjacent chunks, create mountain ranges with z
