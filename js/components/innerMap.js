function generateCells(){
	for (y=0; y<app.totalY; y++){
		for (x=0; x<app.totalX; x++){
			if (rand(0,(10 - app.myPop.cell.env.density)) === 1){
				app.myPop.cell.inner.push({
					x: x,
					y: y,
					o: true
				});
			} else {
				app.myPop.cell.inner.push({
					x: x,
					y: y,
					o: false
				});
			}
		}
	}
	getCellByXY(app.myPop.cell.x,app.myPop.cell.y).inner = app.myPop.cell.inner;
}

function drawCells(d){
	app.myPop.cell.inner.forEach(function(el){
		if ((el.y+1)*app.inner.sideLen > app.gameArea.offsetY){
			if ((el.x+1)*app.inner.sideLen > app.gameArea.offsetX){
				if (el.o === true){
					app.innerCtx.fillStyle = 'darkgrey';
					app.innerCtx.fillRect(((el.x*d)-app.gameArea.offsetX), ((el.y*d)-app.gameArea.offsetY), d, d);
					app.innerCtx.strokeStyle = 'black';
					app.innerCtx.strokeRect(((el.x*d)-app.gameArea.offsetX), ((el.y*d)-app.gameArea.offsetY), d, d);
				} else {
					// app.innerCtx.imageSmoothingEnabled = false;
					app.innerCtx.fillStyle = app.myPop.cell.env.color;
					app.innerCtx.fillRect(((el.x*d)-app.gameArea.offsetX), ((el.y*d)-app.gameArea.offsetY), d, d);
					app.innerCtx.strokeStyle = 'black';
					app.innerCtx.strokeRect(((el.x*d)-app.gameArea.offsetX), ((el.y*d)-app.gameArea.offsetY), d, d);
				}
			}
		}
	});
}

function drawChar(d){
	app.innerCtx.fillStyle = 'red';
	app.innerCtx.fillRect((app.innerMap.width/2),(app.innerMap.height/2), d, d);
}

function startGame(){
	app.innerMap.width = app.viewport.w;
	app.innerMap.height = app.viewport.h;

	generateCells();

	app.gameArea.start();

	// requestAnimationFrame(function drawStartGame(e){
	// 	app.inner.animate

	// 	requestAnimationFrame(drawStartGame);
	// });
	requestAnimationFrame(app.inner.animate);
}

function updateGameArea(){
	app.gameArea.clear();

	if (app.gameArea.keys && app.gameArea.keys[65]){
		app.gameArea.offsetX -= app.inner.moveBy;
	}
	if (app.gameArea.keys && app.gameArea.keys[68]){
		app.gameArea.offsetX += app.inner.moveBy;
	}
	if (app.gameArea.keys && app.gameArea.keys[87]){
		app.gameArea.offsetY -= app.inner.moveBy;
	}
	if (app.gameArea.keys && app.gameArea.keys[83]){
		app.gameArea.offsetY += app.inner.moveBy;
	}

	app.gameArea.draw();
}

function stopAnimation(){
	clearInterval(app.inner.animate);
}
