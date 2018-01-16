function Hexagon(name,a,b,c,d,e,f){
	this.name = name;
	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;
	this.e = e;
	this.f = f;
}
function rand(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}
var totalHexes = Math.pow(6,6);
var hexArray = [];

for (var i = 0; i < totalHexes; i++) {
	hexArray.push(new Hexagon(('hex'+i),rand(1, 6),rand(1, 6),rand(1, 6),rand(1, 6),rand(1, 6),rand(1, 6)));
}
