var cellEncryptKey = {
	'01':'a',
	'02':'b',
	'03':'c',
	'11':'d',
	'12':'e',
	'13':'f',
	'14':'g',
	'15':'h',
	'16':'i',
	'21':'j',
	'22':'k',
	'23':'l',
	'24':'m',
	'25':'n',
	'26':'o',
	'31':'p',
	'32':'q',
	'33':'r',
	'34':'s',
	'35':'t',
	'36':'u',
	'41':'v',
	'42':'w',
	'43':'x',
	'44':'y',
	'45':'z',
	'46':'A'
};

// _Save Game

function cellEncrypt(){
	var savedCells = [],
		shortened = [],
		counter = 0;

	app.cellArray.forEach(function(el, i){
		savedCells.push(
			cellEncryptKey[el.z + '' + el.m]
		);
	});

	savedCells.forEach(function(el, i){
		if (el === savedCells[i-1]){
			counter += 1;
		} else {
			if (counter != 0){
				counter = counter - 1;
				if (counter != 0){
					shortened.push(counter);
				}
			}

			shortened.push(el);
			counter = 0;
		}
	});

	savedCells = shortened.join('');

	return savedCells;
}

function cellDecrypt(rbString){
	var cells = rbString.match(/([a-zA-Z])([0-9]+)?/ig),
		newCellArray = [],
		counter = 0,
		counterXY = 0,
		pushNewCell = function(array, el){
			array.push({
				env: app.environmentArray['env' + getKeyByValue(cellEncryptKey, el.toString())],
				z: parseInt(getKeyByValue(cellEncryptKey, el.toString()).substr(0,1)),
				m: parseInt(getKeyByValue(cellEncryptKey, el.toString()).substr(1,1)),
			});
		};

	cells.forEach(function(el,i){
		if (el.length > 1){
			var letter = el.match(/[a-zA-Z]/),
				number = el.match(/[0-9]+/);

			for (n = 0; n < parseInt(number); n++){
				pushNewCell(newCellArray, letter)
			}

			counter += parseInt(number);
		} else {
			if (i != (cells.length-1)){
				pushNewCell(newCellArray, el);
				counter += 1;
			} else {
				for (n = 0; n < ((app.totalX*app.totalY) - counter); n++){
					pushNewCell(newCellArray, el);
				}
			}
		}
	});

	for (y=0; y<app.totalY; y++){
		for (x=0; x<app.totalX; x++){
			newCellArray[counterXY].x = x+1;
			newCellArray[counterXY].y = y+1;
			counterXY += 1;
		}
	}

	return newCellArray;
}
