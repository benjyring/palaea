var lastMove = 0;
var eventThrottle = 16;


function setFrame(callback){
	app.viewport.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	app.viewport.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	app.viewport.minZoom = Math.max(Math.ceil(app.viewport.w/(app.totalX*app.sideLen)), Math.ceil(app.viewport.h/(app.totalY*app.sideLen)));

	if (callback){
		callback();
	}
}

addEvent(window, 'resize', function(){
	app.viewport.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	app.viewport.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
});


addEvent(document, 'mousemove', function(e){
	if (app.viewport.view === 'cell'){
		var dot,
			eventDoc,
			doc,
			body,
			pageX,
			pageY,
			now = Date.now();

		e = e || window.event; // IE-ism

		e.preventDefault();

		if (now > lastMove + eventThrottle) {
			lastMove = now;
			// This limits the sheer quantity of events thrown by mousemove
			// Everything in this statement is thrown less often than it might be


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

			app.mouse.x = e.pageX;
			app.mouse.y = e.pageY;

			//Do stuff with app.mouse from here on
			if (app.mouse.down === true){
				var endMouseX = app.mouse.x/app.viewport.zoom,
					endMouseY = app.mouse.y/app.viewport.zoom,
					tempOffsetX = app.viewport._offset.startX - endMouseX,
					tempOffsetY = app.viewport._offset.startY - endMouseY,
					potentialOffsetX = app.viewport._offset.x + tempOffsetX,
					potentialOffsetY = app.viewport._offset.y + tempOffsetY,
					availableOffsetX = (app.totalX * app.sideLen * app.viewport.zoom) - app.viewport.w,
					availableOffsetY = (app.totalY * app.sideLen * app.viewport.zoom) - app.viewport.h;

				if (potentialOffsetX >= 0){
					if (potentialOffsetX >= availableOffsetX){
						app.viewport._offset.x = availableOffsetX;
					} else {
						app.viewport._offset.x = potentialOffsetX;
					}
				} else {
					app.viewport._offset.x = 0;
				}

				if (potentialOffsetY >= 0){
					if (potentialOffsetY >= availableOffsetY){
						app.viewport._offset.y = availableOffsetY;
					} else {
						app.viewport._offset.y = potentialOffsetY;
					}
				} else {
					app.viewport._offset.y = 0;
				}

				mapVis(app.viewport.zoom);
			}
		}
	}
});

addEvent(document, 'mousedown', function(e){
	if (app.viewport.view === 'cell'){
		app.viewport._offset.startX = app.mouse.x/app.viewport.zoom;
		app.viewport._offset.startY = app.mouse.y/app.viewport.zoom;

		app.mouse.down = true;
	}
});

addEvent(document, 'mouseup', function(e){
	if (app.viewport.view === 'cell'){
		app.mouse.down = false;
	}
});
