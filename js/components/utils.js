function addEvent(object, type, callback){
	if (object == null || typeof(object) == 'undefined') return;
	if (object.addEventListener) {
		object.addEventListener(type, callback, false);
	} else if (object.attachEvent) {
		object.attachEvent("on" + type, callback);
	} else {
		object["on"+type] = callback;
	}
}

function isOdd(num){
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

function containsAnObject(obj, list){
	for (var i = 0; i < list.length; i++) {
		if (list[i] === obj) {
			return true;
		}
	}

	return false;
}

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

function roughSizeOfObject(object) {
	var objectList = [];
	var stack = [ object ];
	var bytes = 0;

	while ( stack.length ) {
		var value = stack.pop();

		if ( typeof value === 'boolean' ) {
			bytes += 4;
		}
		else if ( typeof value === 'string' ) {
			bytes += value.length * 2;
		}
		else if ( typeof value === 'number' ) {
			bytes += 8;
		}
		else if
		(
			typeof value === 'object'
			&& objectList.indexOf( value ) === -1
		)
		{
			objectList.push( value );

			for( var i in value ) {
				stack.push( value[ i ] );
			}
		}
	}
	return bytes;
}

function arraysAreEqual(ary1,ary2){
	return (ary1.join('') == ary2.join(''));
}

function findOnce(arr1, arr2){
	return arr1.some(r => arr2.includes(r));
}

function fireOnCompletion(completion, functionToRun){
	if (completion === true){
		functionToRun();
	} else {
		fireOnCompletion(completion, functionToRun);
	}
}

function diffXY(cell1, cell2){
	return {
		diffX: Math.abs(cell2.x - cell1.x),
		diffY: Math.abs(cell2.y - cell1.y)
	}
}
