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

var totalCells = Math.pow(4,7);
var cellArray = [];

for (var i = 0; i < totalCells; i++) {
	var newMapCell = new mapCell('cell-'+i);
	cellArray.push(newMapCell);
	var mapCellDiv = document.createElement('div');
	mapCellDiv.id = newMapCell.name;
	mapCellDiv.className = 'borders t-' + newMapCell.a + ' r-' + newMapCell.b + ' b-' + newMapCell.c + ' l-' + newMapCell.d;
	document.getElementById('map').appendChild(mapCellDiv);
}

// TO DO
// 1. Vary Side Lengths
//specify an empty points array
var points = [];

//get a random number in range min, max - 1
function randRange(min, max) {
	return Math.floor(Math.random() * ((max) - min) + min);
}

function definePoints(numPoints, mapSize) {
	//we want to take a group of points that will fit on our map at random
	for(var i = 0; i < numPoints; i++) {
		//here's the random points
		var x = randRange(0, mapSize);
		var y = randRange(0, mapSize);
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
