Game.viewport = new Object;
Game.viewport.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
Game.viewport.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

Game.viewport._offset = new Object;
Game.viewport._offset.x = 0;
Game.viewport._offset.y = 0;
Game.viewport._offset.startX = Game.viewport._offset.x;
Game.viewport._offset.startY = Game.viewport._offset.y;
Game.mouse = new Object;


addEvent(window, 'resize', function(){
	Game.viewport.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	Game.viewport.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
});


addEvent(document, 'mousemove', function(e){
	var dot,
		eventDoc,
		doc,
		body,
		pageX,
		pageY;

	e = e || window.event; // IE-ism

	// If pageX/Y aren't available and clientX/Y are,
	// calculate pageX/Y - logic taken from jQuery.
	// (This is to support old IE)
	if (e.pageX == null && e.clientX != null) {
		eventDoc = (e.target && e.target.ownerDocument) || document;
		doc = eventDoc.documentElement;
		body = eventDoc.body;

		e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
		e.pageY = e.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0 );
	}

	Game.mouse.x = e.pageX;
	Game.mouse.y = e.pageY;

	//Do stuff with Game.mouse from here on
	// console.clear();
	// console.log(Game.mouse.x + ' X and ' + Game.mouse.y + ' Y');
});

addEvent(document, 'mousedown', function(e){
	Game.viewport._offset.startX = Game.mouse.x;
	Game.viewport._offset.startY = Game.mouse.y;

	console.log('vvvvvvvvvvvv');
	console.log('Game.viewport._offset.x: ' + Game.viewport._offset.x);
	console.log('Game.viewport._offset.y: ' + Game.viewport._offset.y);
});

addEvent(document, 'mouseup', function(e){
	var endMouseX = Game.mouse.x,
		endMouseY = Game.mouse.y,
		tempOffsetX = Game.viewport._offset.startX - endMouseX,
		tempOffsetY = Game.viewport._offset.startY - endMouseY,
		potentialOffsetX = Game.viewport._offset.x + tempOffsetX,
		potentialOffsetY = Game.viewport._offset.y + tempOffsetY,
		availableOffsetX = (totalX * sideLen * zoom) - Game.viewport.w,
		availableOffsetY = (totalY * sideLen * zoom) - Game.viewport.h;

	if (potentialOffsetX >= 0){
		if (potentialOffsetX >= availableOffsetX){
			Game.viewport._offset.x = availableOffsetX;
		} else {
			Game.viewport._offset.x = potentialOffsetX;
		}
	} else {
		Game.viewport._offset.x = 0;
	}

	if (potentialOffsetY >= 0){
		if (potentialOffsetY >= availableOffsetY){
			Game.viewport._offset.y = availableOffsetY;
		} else {
			Game.viewport._offset.y = potentialOffsetY;
		}
	} else {
		Game.viewport._offset.y = 0;
	}

	console.log('^^^^^^^^^^^^');
	console.log('potentialOffsetX: ' + potentialOffsetX);
	console.log('potentialOffsetY: ' + potentialOffsetY);
	console.log('tempOffsetX: ' + tempOffsetX);
	console.log('tempOffsetY: ' + tempOffsetY);
	console.log('Game.viewport._offset.x: ' + Game.viewport._offset.x);
	console.log('Game.viewport._offset.y: ' + Game.viewport._offset.y);
	console.log('___________________________');
});
