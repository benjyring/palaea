window.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
window.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
window.m = new Object;

addEvent(window, 'resize', function(){
	w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
});


addEvent(document, 'mousemove', function(e){
	var dot, eventDoc, doc, body, pageX, pageY;

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

	m.x = e.pageX;
	m.y = e.pageY;

	console.clear();
	console.log(m.x + ' X and ' + m.y + ' Y');
});

// addEvent(document, 'mousedown', function(e){

// }
