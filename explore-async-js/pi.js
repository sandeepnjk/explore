/*eslint-env es6*/
/*eslint-disable no-console,no-undef, no-unused-vars, no-empty, no-redeclare*/


/*
var state = {};
state.k = 0;
state.pi = 0;
var i;

setInterval(this.postMessage(state), 1000);
//does not work - The worker thread is busy in the calculation below.
//Periodic update happens all at once, once the calc is over, and continues on.

//Timer Hack, simple but inefficient.
var time =  Date.now();
for (i = 0; i < 10000000; i++) {
	if(Date.now() - time > 1000) {
		this.postMessage(state);
		time = Date.now();
	}
	state.k++;
	state.pi += 4 * Math.pow(-1, state.k + 1)/ (2 * state.k - 1);
}
this.postMessage(state);

//No such feature in js start, stop, sleep etc. :-(
//They are always event driven. They run their own dispatchers.
//At best, call setInterval to restart a fun a few milliseconds, perform a return to free the thread.
//(note: same as UI Thread)

//Note: The thread does not stop after the above computation is done. it services/waits on the event queue.

//To terminate the worker thread from here..
this.close(); 


//Error: Worker thread throws an exception then it has a chance to  handle its own error event. 
//If it doesn't then the error event is passed to the  thread that created the worker where it can be handled and canceled. 
*/






//Asynchronous Worker Thread - Making the worker thread responsive
//Send state messages etc..
//not block the worker thread or monopolize it.
//Note: Add a worker thread does not make you free from the concerns of asynchronous thread.

var pi;
this.addEventListener("message", function(event) {
	switch (event.data) {
		case "start":
			//console.log("Starting WT");
			computePiAsync();
			break;
		case "update":
			//console.log("posting to UI Thread")
			postMessage(pi);
			break;
		case "stop":
			//console.log("Closing WT")
			close();
			break;
	}
});

function* genComputePi() {
	var k;
	var pi = 0;
	for (k = 1; k <= 1000000; k++) {
		pi += 4 * Math.pow(-1, k + 1) / (2 * k - 1);
		if (Math.trunc(k / 1000) * 1000 === k) yield pi;
	}
}

function computePiAsync() {
	var computePi = genComputePi();
	function resume() {
		pi = computePi.next();
		
		if (!pi.done) {
			//console.log(`pi.value = ${pi.value}, pi.done = ${pi.done} `);
			setTimeout(resume, 0);
		}
		if (pi.done) {
			//console.log(`pi.value = ${pi.value}, pi.done = ${pi.done} `);
			postMessage(pi);
		}
		return;
	}
	setTimeout(resume, 0);
	return;
}





