if (isEmpty(localStorage.savedGame)){
	// =============================
	// BUILD THE WORLD
	// =============================
	mapGrid(app.totalY, app.totalX, function(){
		createPlates(rand(36, 48), function(){
			pathFinder(function(){
				plateGeography(function(){
					// _Build Map
					mapBorderPlates(function(){
						landTexture(function(){});
						makeIslands(function(){
							minimizeCellData(function(){
								app.myPop = {};
								app.popCount = (app.platesArray.filter(plate => !app.inaccessible.includes(plate.env.type)).length) * 4;
								app.max = 10;
								// =============================
								// Create Populations on the map
								// =============================
								generatePops(function(){
									setMyPop();
								});
								// =============================
							});
						});
					});
				});
			});
		});
	});
	// =============================
} else {
	setTimeout(function(){
		updateUI(app.myPop);
		mapVis(app.viewport.minZoom);
	}, 4000);
	app = JSON.parse(localStorage.savedGame);
}