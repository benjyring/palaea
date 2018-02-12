function mapCell(name,a,b,c,d){
	this.name = name;
	this.a = a || rand(1, 4);
	this.b = b || rand(1, 4);
	this.c = c || rand(1, 4);
	this.d = d || rand(1, 4);
}

function rand(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

// var totalCells = 400 * 225;// Just a number. May be updated in the future. 16x9 aspect ratio
var cellArray = [];


function mapGrid( rows, cols ){
	var i = 0;
	var grid = document.getElementById('map');
	for (var r = 0; r < rows; ++r){
		var tr = grid.appendChild(document.createElement('tr'));
		for (var c = 0; c < cols; ++c){
			var newMapCell = new mapCell('X-'+ (c+1) + '-Y-' + (r+1));
			cellArray.push(newMapCell);

			var cell = tr.appendChild(document.createElement('td'));
			cell.id = newMapCell.name;

			cell.className = 'cell t-' + newMapCell.a + ' r-' + newMapCell.b + ' b-' + newMapCell.c + ' l-' + newMapCell.d;
			cell.innerHTML = '<span class="hidden">' + ++i + '</span>';
		}
	}
	return grid;
}

//y, x
mapGrid(95, 150);

// TO DO
// 1. Vary Side Lengths
//specify an empty points array
var points = [];

function definePoints(numPoints, mapSize) {
	//we want to take a group of points that will fit on our map at random
	for(var i = 0; i < numPoints; i++) {
		//here's the random points
		var x = rand(0, mapSize);
		var y = rand(0, mapSize);
		//type: decides which point it is
		//x, y: location
		//citizens: the cells in our grid that belong to this point
		points.push({type: i, x: x, y: y, citizens: []});
	}
	//brute force-y but it works
	//for each cell in the grid
	for(var x = 0; x < mapSize; x++) {
		for(var y = 0; y < mapSize; y++) {
			//find the nearest point
			var lowestDelta = {pointId: 0, delta: mapSize * mapSize};
			for(var p = 0; p < points.length; p++) {
				//for each point get the difference in distance between our point and the current cell
				var delta = Math.abs(points[p].x - x) + Math.abs(points[p].y - y);
				//store the point as nearest if it's closer than the last one
				if(delta < lowestDelta.delta) {
					lowestDelta = {pointId: p, delta: delta};
				}
			}
			//push the cell to the nearest point
			var activePoint = points[lowestDelta.pointId];
			var dx = x - activePoint.x;
			var dy = y - activePoint.y;
			//log delta in cell for drawing
			activePoint.citizens.push({
				dx: dx, 
				dy: dy
			});
		}
	}
}

definePoints(20, 40);

for(var point of points) {
	for(var citizen of point.citizens) {
		//set color of cell based on point
		//draw cell at (point.x + citizen.dx) * cellSize, (point.y + citizen.dy) * cellSize
	}
}
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
// 7. Set ocean height at random value
// 8. Cells above this value, place in new array of chunks
