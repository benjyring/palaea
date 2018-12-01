function getTileByXY(cell, tileX, tileY){
	return cell.inner.filter(tile => tile.x == tileX && tile.y == tileY)[0];
}

function generateTiles(){
	for (y=0; y<app.totalY; y++){
		for (x=0; x<app.totalX; x++){
			var oBool;

			if (rand(0,(10 - app.myPop.cell.env.density)) === 1){
				oBool = true;
			} else {
				oBool = false;
			}

			app.myPop.cell.inner.push({
				x: x+1,
				y: y+1,
				o: oBool
			});
		}
	}
	getCellByXY(app.myPop.cell.x,app.myPop.cell.y).inner = app.myPop.cell.inner;
}

function drawTiles(d){
	app.myPop.cell.inner.forEach(function(el){
		if ((el.y)*app.inner.sideLen > app.gameArea.offsetY){
			if ((el.x)*app.inner.sideLen > app.gameArea.offsetX){
				if (el.o === true){
					app.innerCtx.fillStyle = 'darkgrey';
					app.innerCtx.fillRect((((el.x-1)*d)-app.gameArea.offsetX), (((el.y-1)*d)-app.gameArea.offsetY), d, d);
					app.innerCtx.strokeStyle = 'black';
					app.innerCtx.strokeRect((((el.x-1)*d)-app.gameArea.offsetX), (((el.y-1)*d)-app.gameArea.offsetY), d, d);
				} else {
					app.innerCtx.imageSmoothingEnabled = false;
					// app.innerCtx.fillStyle = app.myPop.cell.env.color;
					// app.innerCtx.fillRect((((el.x-1)*d)-app.gameArea.offsetX), (((el.y-1)*d)-app.gameArea.offsetY), d, d);

					app.innerCtx.drawImage(
						document.getElementById(app.myPop.cell.env.type),
						(((el.x-1)*d)-app.gameArea.offsetX),
						(((el.y-1)*d)-app.gameArea.offsetY),
						d,
						d
					);

					app.innerCtx.strokeStyle = 'black';
					app.innerCtx.strokeRect((((el.x-1)*d)-app.gameArea.offsetX), (((el.y-1)*d)-app.gameArea.offsetY), d, d);
				}
			}
		}
	});
}

function drawChar(d){
	app.innerCtx.fillStyle = 'red';
	app.innerCtx.fillRect((app.innerMap.width/2),(app.innerMap.height/2), d, d);
}

function getCharTile(offsetX, offsetY){
	var halfCharLen = app.inner.sideLen/4,
		halfScreenHeight = app.innerMap.height/2,
		halfScreenWidth = app.innerMap.width/2,
		tileOffsetX = Math.round(offsetX/app.inner.sideLen),
		tileOffsetY = Math.round(offsetY/app.inner.sideLen);

	return getTileByXY(
		app.myPop.cell,
		Math.floor((halfScreenWidth + halfCharLen)/app.inner.sideLen)+ tileOffsetX + 1,
		Math.floor((halfScreenHeight + halfCharLen)/app.inner.sideLen) + tileOffsetY + 1
	);
}

function detectObstacle(){
	// TO DO
	// INCOMPLETE
	var obstacle = false;

	if (getPlayerTile().o === true){
		obstacle = true;
	}

	return obstacle;
}

function startGame(){
	app.innerMap.width = app.viewport.w;
	app.innerMap.height = app.viewport.h;

	if (isEmpty(app.myPop.cell.inner)){
		generateTiles();
	}

	app.gameArea.listen();

	startAnimation();
}

function updateGameArea(){
	app.gameArea.clear();

	if (app.gameArea.keys && app.gameArea.keys[65]){
		var innerOffsetX = app.gameArea.offsetX - app.inner.moveBy,
			innerOffsetY = app.gameArea.offsetY;

		if (getCharTile(innerOffsetX, innerOffsetY).o === false){
			app.gameArea.offsetX = innerOffsetX;
		}
	}
	if (app.gameArea.keys && app.gameArea.keys[68]){
		var innerOffsetX = app.gameArea.offsetX + app.inner.moveBy,
			innerOffsetY = app.gameArea.offsetY;

		if (getCharTile(innerOffsetX, innerOffsetY).o === false){
			app.gameArea.offsetX = innerOffsetX;
		}
	}
	if (app.gameArea.keys && app.gameArea.keys[87]){
		var innerOffsetX = app.gameArea.offsetX,
			innerOffsetY = app.gameArea.offsetY - app.inner.moveBy;

		if (getCharTile(innerOffsetX, innerOffsetY).o === false){
			app.gameArea.offsetY = innerOffsetY;
		}
	}
	if (app.gameArea.keys && app.gameArea.keys[83]){
		var innerOffsetX = app.gameArea.offsetX,
			innerOffsetY = app.gameArea.offsetY + app.inner.moveBy;

		if (getCharTile(innerOffsetX, innerOffsetY).o === false){
			app.gameArea.offsetY = innerOffsetY;
		}
	}

	app.gameArea.draw();
}

function startAnimation(){
	animLoop(function(deltaT) {
		updateGameArea();
	}, app.innerMap );
}

function stopAnimation(){
	// window.cancelAnimationFrame(animLoop);
	app.gameArea.running = false;
}
