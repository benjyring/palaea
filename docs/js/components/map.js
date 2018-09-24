function getCellByXY(elX, elY){
	// Returns a single cell by inputting X and Y coordinates
	return cellArray.filter(cell => cell.x == elX && cell.y == elY)[0];
}

function checkPlus(el){
	// Returns an array of the "plus" shape of cells surrounding the passed cell.
	// Ordered North, East, South, West
	return [getCellByXY(el.x, el.y - 1), getCellByXY(el.x + 1, el.y), getCellByXY(el.x, el.y + 1), getCellByXY(el.x - 1, el.y)];
}

function zmod(cc,raiseBy,degreeOfVariation){
	var existingZ = cc.z,
	newZ = rand((raiseBy + existingZ), (raiseBy*Math.abs(degreeOfVariation)));
	cc.z = newZ;
}

function mMod(cc,raiseBy,degreeOfVariation){
	var existingm = cc.m,
	newm = rand((raiseBy + existingm), (raiseBy*Math.abs(degreeOfVariation)));
	cc.m = newm;
}

function modifySurroundingZ(el){
	var cellTo1N = getCellByXY(el.x, (el.y - 1)),
	cellTo1E = getCellByXY((el.x + 1), el.y),
	cellTo1S = getCellByXY(el.x, (el.y + 1)),
	cellTo1W = getCellByXY((el.x - 1), el.y),
	cellTo2N = getCellByXY(el.x, (el.y - 2)),
	cellTo2E = getCellByXY((el.x + 2), el.y),
	cellTo2S = getCellByXY(el.x, (el.y + 2)),
	cellTo2W = getCellByXY((el.x - 2), el.y),
	cellAway1 = [cellto1N, cellto1E, cellto1S, cellto1W],
	cellAway2 = [cellto2N, cellto2E, cellto2S, cellto2W];

	for (i = 0; i < cellAway1.length; i++){
		var difference = el.z - cellAway2[i].z;
		zmod(cellAway1[i], 2, difference);
	}
}

function mapCell(x,y,z,m,inland,plate,plateBorder,mapBorder){
	this.x = x;
	this.y = y;
	this.z = z;
	this.m = m;
	this.inland = inland || false;
	this.plate = plate;
	this.plateBorder = plateBorder || false;
	this.mapBorder = mapBorder || false;
}

function mapGrid(rows, cols, callback){
	for (var r = 0; r < rows; ++r){
		for (var c = 0; c < cols; ++c){
			cellArray.push(
				new mapCell(c+1, r+1, 1)
			);
		}
	}
	mapGridCompleted = true;
	callback();
}

function createPlates(numberOfPlates, callback){
	for (var c = 0; c < numberOfPlates; c++){
		var randX = rand(1, totalX),
		randY = rand(1, totalY),
		plateNumber = (c+1),
		rXrY = getCellByXY(randX, randY);

		rXrY.plate = plateNumber;
		platesArray.push(rXrY);
	}
	createPlatesCompleted = true;
	callback();
}

function pathFinder(callback){
	for (var i = 0; i < cellArray.length; i++){
		var paths = [],
		pathsObj = {};

		for (var c = 0; c < platesArray.length; c++){
			paths.push(
				(diffXY(cellArray[i], platesArray[c]).diffX + diffXY(cellArray[i], platesArray[c]).diffY) +
				':' + platesArray[c].plate.toString()
			);
		}

		for (var d = 0; d < paths.length; d++) {
			var split = paths[d].split(':');

			pathsObj[split[0].trim()] = split[1].trim();
		}

		var min = Object.keys(pathsObj).min(),
		shortest = pathsObj[min];

		cellArray[i].plate = shortest;
	}
	pathFinderCompleted = true;
	callback();
}

function plateGeography(callback){
	for (var c = 0; c < platesArray.length; c++){
		platesArray[c].force = rand(1,10);
		platesArray[c].direction = rand(1,4);
	}

	for (var i = 0; i < cellArray.length; i++){
		var cc = cellArray[i],
		cp = platesArray[parseInt(cc.plate) - 1],
		cpd = cp.direction,
		ce, pe, ped, pef,
		cs, ps, psd, psf;

		if (getCellByXY(cc.x+1, cc.y)){
			var ce = getCellByXY(cc.x+1, cc.y),
			pe = platesArray[parseInt(ce.plate) - 1],
			ped = pe.direction,
			pef = pe.force;
		}

		if (getCellByXY(cc.x+1, cc.y)){
			var cs = getCellByXY(cc.x+1, cc.y),
			ps = platesArray[parseInt(cs.plate) - 1],
			psd = ps.direction,
			psf = ps.force;
		}

		if (ce != null){
			if (cpd != ped){
				// Checking only the cell to the east
				if (!isOdd(cpd) && !isOdd(ped)){
					if (cpd < ped){
						// Mountain
						zmod(cc,2,pef+psf);
						zmod(ce,2,pef+psf);
					} else {
						// Canyon
						zmod(cc,-2,pef+psf);
						zmod(ce,-2,pef+psf);
					}
				} else if ((!isOdd(cpd) && isOdd(ped)) || (isOdd(cpd) && !isOdd(ped)) ) {
					if (cpd < ped){
						// Hill
						zmod(cc,1,pef+psf);
						zmod(ce,1,pef+psf);
					} else {
						// Valley
						zmod(cc,-1,pef+psf);
						zmod(ce,-1,pef+psf);
					}
				}
				cc.plateBorder = true;
			}
		}
		if (cs != null){
			if (cpd != psd){
				// Checking only the cell to the south
				if (isOdd(cpd) && isOdd(psd)){
					if (cpd > psd){
						// Mountain
						zmod(cc,2,pef+psf);
						zmod(ce,2,pef+psf);
					} else {
						// Canyon
						zmod(cc,-2,pef+psf);
						zmod(ce,-2,pef+psf);
					}
				} else if ((!isOdd(cpd) && isOdd(psd)) || (isOdd(cpd) && !isOdd(psd)) ) {
					if (cpd > psd){
						// Hill
						zmod(cc,1,pef+psf);
						zmod(ce,1,pef+psf);
					} else {
						// Valley
						zmod(cc,-1,pef+psf);
						zmod(ce,-1,pef+psf);
					}
				}
				cc.plateBorder = true;
			}
		}
	}
	plateGeographyCompleted = true;
	callback();
}

function mapBorderPlates(callback){
	var mapBorderCells = cellArray.filter(cell => [1, totalX].indexOf(cell.x) > -1 || [1, totalY].indexOf(cell.y) > -1);

	for (var c = 1; c <= platesArray.length; c++){
		var cellsInThisPlate = cellArray.filter(cell => cell.plate == c);

		if (findOnce(cellsInThisPlate, mapBorderCells)){
			if (!isEmpty(platesArray[c])){
				platesArray[c].mapBorder = true;
			}
		}
	}
	mapBorderPlates = true;
	callback();
}

function landTexture(callback){
	for (n = 0; n < cellArray.length; n++){
		let i = cellArray[n];

		if (i.plate > (platesArray.length / 2) || platesArray[i.plate].mapBorder == true){
			// SEA
			i.inland = false;

			if (i.plateBorder != true){
				i.z = 0;
				i.m = 3;
			} else {
				if (i.z >= 20){
					// Island Centers
					if (i.z < 32) {
						i.z = Math.abs(Math.ceil((i.z - 6)/8));
						i.m = Math.abs(Math.ceil((i.z - 6)/5));

						if (i.m === 0){
							i.m = 1;
						}
					} else {
						i.z = 4;
						i.m = 6;
					}
				} else {
					if (i.z > 5){
						// Reefs
						i.m = 2;
						i.z = 0;
					} else {
						// This creates texture in reefs,
						// to break up some long archipelegos
						i.m = 3;
						i.z = 0;
					}
				}
			}
		} else {
			// INLAND
			i.inland = true;
			i.m = 2;

			if (i.z > 0 && i.z < 5){
				i.z = 1;
				// moisture will be determined by an average of distance from water and distance from mountain (z<20)
			} else if (i.z >= 5 && i.z < 10){
				i.z = 2;
			} else if (i.z >= 10 && i.z <= 15){
				i.z = 3;
			} else if (i.z >= 15 && i.z < 20){
				i.z = 4;
				i.m = rand(1, 3);
			} else if (i.z >= 20){
				i.z = 4;
				i.m = rand(4, 6);
			} else {
				i.z = 0;
			}
		}
	}

	var inlandCells = cellArray.filter(cell => cell.inland === true);

	for (n = 0; n < inlandCells.length; n++){
		var tc = inlandCells[n],
		tPlus = checkPlus(tc);

		// Create Shores
		for (i = 0; i < tPlus.length; i++){
			if (tPlus[i].inland === false){
				tPlus[i].m = 2;
			}
		}

		// Create Inland Textures
		if (findOnce(cellArray.filter(cell => cell.inland === false), tPlus)){
			// Beaches
			tc.m = 1;

			if (tc.z === 0){
				// Shrubland
				tc.m = 3;
				tc.z = 3;
			}
		} else {
			if (findOnce(cellArray.filter(cell => cell.inland === true && cell.z === 0), tPlus)){
				var freshwater = cellArray.filter(cell => cell.inland === true && cell.z === 0);

				for (i = 0; i < freshwater.length; i++){
					freshwater[i].m = 1;
				}
				// RIVER BASINS
				// ===============
				//
				// Generate trees spreading from freshwater sources
				for (i = 0; i < tPlus.length; i++){
					if (!isEmpty(tPlus[i]) && tPlus[i].inland === true && tPlus[i].z >= 1){
						tPlus[i].m = rand(4,6);
						tPlus[i].z = rand(1,2);

						// Generate lighter forests further from the water
						var tPlusX = checkPlus(tPlus[i]);

						for (c = 0; c < tPlusX.length; c++){
							if (!isEmpty(tPlusX[c]) && tPlusX[c].inland === true && tPlusX[c].z >= 1){
								tPlusX[c].m = rand(3,5);
								tPlusX[c].z = rand(1,3);

								// Generate brushy patches
								var tPlusXX = checkPlus(tPlusX[c]);

								for (l = 0; l < tPlusXX.length; l++){
									if (!isEmpty(tPlusXX[l]) && tPlusXX[l].inland === true && tPlusXX[l].z >= 1){
										tPlusXX[l].m = rand(2,4);
										tPlusXX[l].z = rand(1,2);
									}
								}
							}
						}
					}
				}
			} else if (findOnce(cellArray.filter(cell => cell.inland === true && cell.z >= 4), tPlus)){
				// MOUNTAIN RANGES
				// ===============
				//
				// Generate smaller peaks in a radius
				for (i = 0; i < tPlus.length; i++){
					if (tPlus[i].z <= 3){
						tPlus[i].m = rand(1,3);
						tPlus[i].z = rand(2,3);

						// Generate foothills and forests at the bases of the ranges
						var tPlusX = checkPlus(tPlus[i]);

						for (c = 0; c < tPlusX.length; c++){
							if (!isEmpty(tPlusX[c]) && tPlusX[c].inland === true && tPlusX[c].z <= 2 && tPlusX[c].m > 1){
								tPlusX[c].m = rand(3,5);
								tPlusX[c].z = rand(1,3);

								// Generate spotty forests at the bases of foothills
								var tPlusXX = checkPlus(tPlusX[c]);

								for (l = 0; l < tPlusXX.length; l++){
									if (!isEmpty(tPlusXX[l]) && tPlusXX[l].inland === true && tPlusXX[l].z <= 2 && tPlusXX[l].m > 1){
										tPlusXX[l].m = rand(2,4);
										tPlusXX[l].z = rand(1,2);
									}
								}
							}
						}
					}
				}
			}
		}
	}
	landTextureCompleted = true;
	callback();
}

function makeIslands(callback){
	var islands = cellArray.filter(cell => cell.inland == false && cell.m > 3);

	for (n = 0; n < islands.length; n++){
		var island = checkPlus(islands[n]);

		for (i = 0; i < island.length; i++){
			if (!isEmpty(island[i]) && island[i].z < 4){
				island[i].z=1;
			}
		}
		islands[n].z = 3;
	}
	makeIslandsCompleted = true;
	callback();
}

function minimizeCellData(){
	cellArray.forEach(function(cell){
		cell.env = environmentArray['env' + cell.z.toString() + cell.m.toString()];
	});

	minimizeCellDataCompleted = true;
}


// BUILD THE WORLD
mapGrid(totalY, totalX, function(){
	createPlates(rand(36, 48), function(){
		pathFinder(function(){
			plateGeography(function(){
				// _Build Map
				mapBorderPlates(function(){
					landTexture(function(){});
					makeIslands(function(){
						minimizeCellData();
					});
				});
			});
		});
	});
});