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
