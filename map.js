function Hexagon(name,a,b,c,d,e,f){
	this.name = name;
	this.a = a || rand(1, 6);
	this.b = b || rand(1, 6);
	this.c = c || rand(1, 6);
	this.d = d || rand(1, 6);
	this.e = e || rand(1, 6);
	this.f = f || rand(1, 6);
}

function rand(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

var totalHexes = Math.pow(6,6);
var hexArray = [];

for (var i = 0; i < totalHexes; i++) {
	hexArray.push(new Hexagon('hex'+i));
}

// TO DO
// 1. Vary Side Lengths
// 2. Make these lengths make visual sense
if (previous row exists && while in row of hexes){
	currentHex.f.length = previousRowHexMinus1.c.length;
	currentHex.a.length = previousRowHex.d.length;
	currentHex.b.length = previousRowHexPlus1.e.length;
}
// 3. Randomly decide main-point hexagons WITHIN a margin from map edges
// 4. Loop through hexagons, see which main point is closest
// 5. Make array of chunks
// 6. On edges of adjacent chunks, create mountain ranges with z
// 7. Set ocean height at random value
// 8. Hexes above this value, place in new array of chunks
