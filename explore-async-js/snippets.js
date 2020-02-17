/*eslint-env es6*/
/*eslint-disable no-console,no-undef, no-unused-vars, no-empty, no-redeclare*/

/*====================
Recap on Javascript 
- The JavaScript UI is single-threaded.  
- The dispatcher uses the UI thread to handle events. When an event  happens it is added to the dispatch queue and the dispatcher allows  each event to execute on the UI thread in turn.  
- Once an event handler has the UI thread it keeps it until it has  finished.  
- This means that while any JavaScript code is running no other event  can be handled and the UI is unresponsive.  
- If an event handler runs for a long time then the user will notice that  the UI has frozen. 
- The ideal JavaScript program does nothing but leave the UI thread  idle waiting to service an event.  
- You can add event handlers to an object using its addEventListener  method.  
- An object can have multiple event handlers in its event listener list.  
- Bubbling and capture make event handling most sophisticated and  implementation simpler.  
- You can trigger an event, existing or custom, using the object's  dispatchEvent method with a suitable Event object.  
- The dispatchEvent method behaves more like a function call than a  true event. That is, it creates a synchronous event.  
- If you need a true asynchronous event then you need to use the  setTimeout or postMessage method to add a function which triggers  the event to the dispatch queue.  
- A JavaScript program is a collection of event handlers, the only  purpose the main or global code serves is to initialize things. 

*/

//============ 1. JS RECAP ========================
/*
//The Dispatch Queue and UI Thread

	|Event 4 | tail           |       |
	|Event 3 |				  |       |
	|Event 2 |				  |       |
	|Event 1 |				  |       |
	|--------| head           |-------|
		|                       
		|                       
		V                      [waiting for Event]
===UI Thread==>Event0         ===UI Thread==>
			   function() {}

*/

//Event Object 
//DOM is not a part of Javascript.
//only available when JS is running in the Browser.
//DOM elements can generate Events, which are added to the Dispatcher's queue.
//Details of the event are also stored in the queue as Event Object


//Registering Event Handlers/Listeners


///////////////////////////
// Multiple Event Listeners
////////////////////////////
const btn1 = document.querySelector("#btn1");
/*
btn1.addEventListener("click", myEventHandler1);
btn1.addEventListener("click", myEventHandler2);

function myEventHandler1(e) {
	console.log("myEvntHandler1 called");
}

function myEventHandler2(e) {
	console.log("myEvntHandler2 called");
}
*/
//note: order is not guarenteed
//generall multiple event listners are not reg to a single element.
//but when 2 unrelated actions need to be triggered. eg. do as save on click and also show an ad.



///////////////////////
// Bubbling
//////////////////

const button1 = document.querySelector("#button1");
const div1 = document.querySelector("#div1");

button1.addEventListener("click",myEventHandler2);
div1.addEventListener("click",myEventHandler1);


function myEventHandler1(e) { 
	console.log("div");
}  
function myEventHandler2(e) {
	console.log("button");
} 


/////////////////////////////////////////
// Bubbling to identify what was clicked
/////////////////////////////////////////
/*
const div2 = document.querySelector("#div2");
div2.addEventListener("click",myEventHandler3);
function myEventHandler3(e){ 
	console.log(e.target.id); 
}
*/

/*
/////////////////////////////////////////
// Capture to identify what was clicked
/////////////////////////////////////////

const div2 = document.querySelector("#div2");
const button2 = document.querySelector("#button2");
div2.addEventListener("click",myEventHandler3, true);
button2.addEventListener("click",myEventHandler4);
function myEventHandler3(e){ 
	console.log("div clicked"); 
}
function myEventHandler4(e){ 
	console.log("button1 clicked"); 
}
*/


//////////////////////////////////////////
// Controlling Events
/////////////////////////////////////////
/*
const link1 =  document.querySelector("#link1");
//log instead of navigate
link1.addEventListener("click",myEventHandler4);
function myEventHandler4(event) {
	event.preventDefault(); //page call stopped.
	console.log("Links default behaviour stopped");
	console.log(event.defaultPrevented);
	//event.stopPropagation();
	//event.stopImmediatePropagation();
	//event.isPropagationStopped();
}
//Older Browsers event handling is messy - let jquery handle

*/


////////////////////////////////////////
// Custom Events
////////////////////////////////////////
/*
//use cases: sometimes useful to be able to generate event
// They could existing or completly new
//note: firing events vary from browser to browser

//const btn1 = document.querySelector("#btn1");


//predetermined events (click, focus, blur, submit and reset.)
//ref: https://www.w3schools.com/jsref/dom_obj_event.asp
//var event = new Event('click');
var event = new MouseEvent('click', {
	bubbles: true,
	cancelable: true
});
btn1.addEventListener("click",myEventHandler5);
function myEventHandler5(e) { 
	console.log("Btn 1 Clicked");
}
//console.log("Using dispatch Event.");
//btn1.dispatchEvent(event);
//console.log("Dispatched..");
//note: older creatEvent() ia depricated
*/


//Create your own Event
/*
var myEvent = new Event("myevent", {
	bubbles: true,
	cancelable: true
});

btn1.addEventListener("myevent", function(e) {
	console.log("My Event");
});
btn1.dispatchEvent(myEvent); //Note: myevent isn't a syatem event. we just made it up.
*/



//Event where you want to pass Custom data.
//For including custom data into the event, use the CustomEvent cosntructor, and pass the custom data in the 'detail' property.
/*
var event1 = new CustomEvent('myevent1', {
	bubbles: true,
	cancelable: true,
	detail: "my data, could be string/object"
});

var event2 = new CustomEvent('myevent2', {
	bubbles: true,
	cancelable: true,
	detail: {
		name: "rowan atkins",
		age: 42,
		email: "some email address"
	}
});

btn1.addEventListener("myevent1", function(e) {
	console.log("String custom data");
	console.log(e.detail);
});
btn1.addEventListener("myevent2", function(e) {
	console.log("Object custom data");
	console.log(e.detail);
});
btn1.dispatchEvent(event1);
btn1.dispatchEvent(event2);
*/





////////////////////////////////////////
// Asynchronous Custom Events
////////////////////////////////////////

//Asynchronous custom events
//note:: Dispatch Event is synchronous
//Only events dispatched by UI Thread are async.

//Using var id = setTimeout(func, delay) to add to the dispatch queue
//var id = setInterval(func, delay)
//clearTimeout(id)
//clearInterval(id)
//Ref: https://johnresig.com/blog/how-javascript-timers-work/

/*
var myEvent = new Event("myevent", {
	bubbles: true,
	cancelable: true
});

btn1.addEventListener("myevent", function(e) {
	console.log("My Event");
});
//Sync
console.log("-----Sync-------");
console.log("Before Event");
btn1.dispatchEvent(myEvent);
console.log("After Event");

//Async
console.log("-----Async-------");
console.log("Before Event");
setTimeout(function() {
	btn1.dispatchEvent(myEvent);
}, 0);
console.log("After Event");
*/



/*
//Encapsulated in a fireEvent function
function fireEvent1(elem, ev) {
	var event = new Event(ev, {
		bubbles: true,
		cancelable: true
	});
	elem.addEventListener(ev, function(e) {
		console.log("My Event");
	});
	setTimeout(function() {
		elem.dispatchEvent(event);
	}, 0);
}

console.log("Before Event");
fireEvent1(btn1, "myevent");
console.log("After Event");
*/

//setTime() is convinient but not efficient. 
//Though delay speciefied is 0ms, it will be 10s of millis
//Browser apply a min UI delay of ~4ms/10ms, even if queue is empty.

//Note: So 1000ms / 4 ==> roughly 200 events per second


//Fast asynchronous custom event
//Note: with this approach can generate close to 20,000 events per sec.
//using window.postMessage("fireevent", "*");
//Generally in another window, but faster in the same window.
//The message event is placed in the event queue, when the message payload is "fireEvent".
//As soon as an UI thread is free to process, it picks up the message.
//There is no minimum delay in postMessage()



//Encapsulated in a fireEvent function using window.postMessage()
/*
function fireEvent2(elem, ev) {
	var event = new Event(ev, {
		bubbles: true,
		cancelable: true
	});
	var fire = function (e) {
		elem.dispatchEvent(event);
		console.log("fire called");
		window.removeEventListener("message", fire, false);
	};
	window.addEventListener("message", fire, false);
	window.postMessage(ev, "*")
}

console.log("Before Event");
fireEvent2(btn1, "fireEvent");
console.log("After Event");

*/

//JS Single Threaded model
//No event can be handled while Global code is running - UI Thread will be occupied
//Gobal Code - keep is short, its only for initilizations, adding listeners etc.
//A Big NO -  delay/pause in globals code
//Giving you UI thread toomuch to do when the program (js) starts is a bad practice.
//Global code runs at point in page load where it occurs.

//To run js code at a precise point convert the global code into another event handler.

//DOM may be ready but css images may still be loading/being retrieved.
//document.addEventListener("DOMContentLoaded", function () {});

//Entire page loaded
//window.addEventListener("load", function() {});

//Things not happening in a fixed order - main signature of asynchronius code.



////////////////////////////////////////
// Callback
////////////////////////////////////////


//Asynchronous functions in a non-event system
//The problem arises because of the need to manage the UI thread. [Single Threded UI]
//Blocking and Non Blocking function calls.
//Use of Non-Blocking functions distorts the flow of control.
//Provide a callback to the non-blocking function.
//Easier in javascript as functions are 1st class objects, than in java(anonymous functions) or C#(delegates) or lambdas
//Callback is like an event handler that is fired once the non-blocking has finished its task


function getFile(url, callback)  {
	let xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.send();
	xhr.onload = function() {
		if(xhr.status != 200) {
			console.log(`Error ${xhr.status}: ${xhr.statusText}`);
		} else {
			console.log(`Done, got ${xhr.response.length} bytes`);
			callback();
		}
	};
	xhr.onprogress = function(event) {
		if (event.lengthComputable) {
			console.log(`Received ${event.loaded} of ${event.total} bytes`);
		} else {
			console.log(`Received ${event.loaded} bytes`); // no Content-Length
		}
	};
	xhr.onerror = function() {
		console.log("Request failed");
	}
}


/*
function someCallback() {
	console.log("Some callback called.")
}

//Callback version, will return immediately
getFile("https://cors-anywhere.herokuapp.com/https://www-eng-x.llnl.gov/documents/tests/txt.html", someCallback);
console.log("getFile() called")
*/

/*
//Converting the above to a Event
//note: hacked ajax-jquery .. instead using btn1
var eventHandler= function someEventHandler() {
	console.log("Some event handler called.")
}
var ajax = btn1;
ajax.getfile = function (url)  {
	getFile(url, function () {
		var event = new Event("FileUploaded", {
								bubbles: true,
								cancelable: true
							});
		ajax.dispatchEvent(event);
	});
};

ajax.addEventListener("FileUploaded", eventHandler);
console.log("Before getting file");
ajax.getfile("https://cors-anywhere.herokuapp.com/https://www-eng-x.llnl.gov/documents/tests/txt.html");
*/




//callbacks vs Event Handlers.. diffrences
//- Event handlers are easy to write and cause few problems
//- Are setup by code that have no interest in the results
//- EH don't do anything that the code that sets them up cares about.
//- eg: Code that sets up a button's click handler doesn't want to intereact with the clickhandler, at a later time when the click happens.
//- Its set and forget operation.
//- EH are closed pieces of code, that do not depend on anything other than the event that has just occured, and the global state of the program.
//- Callback, on the other hand, generally do something that the code that sets them up cares about.
// - eg. download a file and process the data it contains. The process is initiated and the code that started it comes to an end, only later the call back is activated and the process is completed elsewhere.
// - callback is a continuation of a non-blocking function, where as an eventhandler isn't a continuation of any particular part of the program


//Problem of callback hell
//sync: loadA(); LoadB(); loadC();
//async:have to make it nested to preserve order - loadA(loadB(loadC()));
//Tendency to think callback is the only way to deal with async code.
//Events too convert sequential flow into nested events, which isn't a lot better.
//loadA.addEventListener("loaded", function(fileA){loadB.get()});
//loadB.addEventListener("loaded", function(fileB){loadC.get()});
//loadC.addEventListener("loaded", function(fileC){....);
//loadA.get()

//sequential flow is easier to implement, gets more difficult if we try to implement conditionals or loops involving non-blocking functions;




////////////////////////////////////////////
// Asynchronous Flow of control and closure
////////////////////////////////////////////
/*
		*************
		* gjhkljhjj * 
Before	* hjkkjhkkj *  Statements before set up context
		* hjkkjhkkj *
		*************
		Text=loadA()
		*************
		* gjhkljhjj * 
After	* hjkkjhkkj *  Statements after use 
		* hjkkjhkkj *  results and previous context
		*************		

//converting the above to non-blocking

		*************
		* gjhkljhjj * 
Before	* hjkkjhkkj *  Statements before set up context
		* hjkkjhkkj *
		*************
		Text=loadA(        callback        )
						*************
						* gjhkljhjj * 
				After	* hjkkjhkkj *  Statements after use 
						* hjkkjhkkj *  results and previous context
						*************		
Control is distorted
Context is lost - no longer access to variables contained in before code
i.e i=i+1 cannot be done, not only out od scope, does not exist

BUT, in javascript the call context is preserved - supports closure

Why Closure?
"The automatic provision of context to a callback function" - Reason for inventing closure
There are other uses of closure - later
Closures ensures that callbacks have their context.
Closures solve many of the problems of callbacks but notall.

NOTE: Existence of and the need to access their call context is one of the big diffrences between a Callback and EventHandler

When event handler is fired it does not have the context of the calling function involved in its activation. 
The context used by event handler is the one passed by event object and the global state of the program
*/



////////////////////////////////////////////
// Asynchronous Errors
////////////////////////////////////////////

//Often ignored, how errors  should be handled
//Error can occur anytime after the callbacks have been set, and in any order.

//sync:
try {
	//loadA(A, callback1;
	//loadB(B, callback2);
	//loadC(case, callback3);
} catch (e) {
	//deal with the problem
}

//If load becomes async, catch will not catch any error produced in the load()
//reason:catch gets executed evin prior to any async function that may get executed.
//How to deal: load(A, success, error);
//The above is easy to propose but difficult to make it work. 
//	- The error fumc has no way to determine the overall state of the transaction that might still be in progress, and, generally no easy way to stop them
//e.g there is no AJAX operation to stop a file download.
//Async error handling is difficult.


///////////////////////////////////////////
// Controlling callback flow
////////////////////////////////////////////
//Controller Pattern - Optional

// - sequential flow of callbacks using nested callbacks
// - using controlling object or sequencer
// - jquery uses - function queue as the controlling object
// - issue: either limited or increasingly complex to cope with more generic situations.

/*
//Controller Object provides methods to manage runnning of non-blocking functions
function longRunA(callback) {
	console.log("A");
	setTimeout(callback, 2000);
}
function longRunB(callback) {
	console.log("B");
	setTimeout(callback, 1000);
}

var controller = {};
controller.queue = [];
controller.add = function (func) {
	controller.queue.push(func);
};


controller.run =  
	function () {
	controller.queue.shift()(controller.run);
};


//longRunA(longRunB);

controller.add(longRunA);
controller.add(longRunB);
//controller.run();

// Seems better than nested callbacks, but has problems
// functions in queue need to have a known set of parameters
// only accepts a callback, also they do no processing..
// to overcome - need to  increase complexiety...
// Controller Object needs to be crafted to suit your particular need.
//Pattern: callback passed to the non-blocking function is a method of the controllor object, that is used to perform the next action.
*/

/*
//Modifing the controllor, to make repeat calls , say try n times..
controller.count = 0;
controller.current = 0;
controller.repeat = function(n) {
	controller.count = n;
	controller.current = controller.queue.shift();
	controller.next();
};
controller.next =  function() {
	if (controller.count === 0) return;
	controller.count -= 1;
	controller.current(controller.next);
}
controller.repeat(3);

//Controller method is particularly appropriate if what we are trying to do fits finite state model.
//However in most cases Promises or async/await are a better option
*/


/*
Summary - Callbacks
- To keep the UI active long running functions are non-blocking and  return the UI thread before they have finished their work.
- Non-blocking functions make use of callbacks or events to process  the results of their work.
- Callbacks are like event handlers, but they generally make use of  the context they were called from.  
- Closure allows a callback to access its call context. 
- Asynchronous code distorts the flow of control – sequential  execution becomes nested callbacks.  
- Asynchronous code makes error handling more difficult than it  already is.  
- One way to implement the traditional flow of control using  asynchronous functions is to implement a controller object which  has methods that are used as callbacks.  
- Controllers work well if the situation can be implemented as a state  machine. 
*/


//////////////////////////////////////////////////////
// Custom Async
/////////////////////////////////////////////////////

//Responsive Javascript app - master the art of creating your own non-blocking asynchronous functions

//Exploring concept of chuncked function - executing the whole function in small chunks

//Calculating Pi //infinite non repeating decimal part.
//pi=4*(1-1/3+1/5-1/7...) 

const button5 = document.querySelector("#button5");
const result = document.querySelector("#result");
const count = document.querySelector("#count");
//button5.addEventListener('click', computePi);

//pi - closure
//var closureComputePi = computePiAsync();
//button5.addEventListener('click', closureComputePi);

//yield-settimeout
//button5.addEventListener('click', computePiAsync);

//for postMessage
button5.addEventListener('click', computePiAsync1); 



/*
//UI Thread appears frozen
function computePi() {
	var pi = 0;
	var k;
	for (k = 1; k <= 100000; k++) {
		pi += 4 * Math.pow(-1, k + 1) / (2 * k - 1);
		result.innerHTML = pi;
		count.innerHTML = k;
		console.log(`pi = ${pi} k=${k}`);
	}
}
//Unacceptable function
*/

/*
var state = {};
state.k =  0;
state.pi =  0;

//Break calculation in chunks - Keep UI responsive
function computePi() {
	if (state.k >= 1000000) return;
	var i;
	for (i = 0; i < 1000; i++) {
		state.k++;
		state.pi += 4 * Math.pow(-1, state.k + 1) / (2 * state.k - 1);
	}
	result.innerHTML = state.pi;
	count.innerHTML = state.k;
	setTimeout(computePi, 0);
}
console.log(state);
*/

/*
//Not good to have the state global - use a closure
function computePiAsync() {
	var state = {};
	state.k =  0;
	state.pi =  0;

	return function computePi() {
		if (state.k >= 1000000) return;
		var i;
		for (i = 0; i < 1000; i++) {
			state.k++;
			state.pi += 4 * Math.pow(-1, state.k + 1) / (2 * state.k - 1);
		}
		result.innerHTML = state.pi;
		count.innerHTML = state.k;
		setTimeout(computePi, 0);
	};
}
console.log(state);
*/

/*
//setTimeout can add 4-5 milliseconds to get the func computePi started
//postMessage to optimize. - but not widely supported...only IE8+
function computePiAsync() {
	var state = {};
	state.k =  0;
	state.pi =  0; 
	return function computePi() {
		if (state.k >= 1000000) return;
		var i;
		for (i = 0; i < 1000; i++) {
			state.k++;
			state.pi += 4 * Math.pow(-1, state.k + 1) / (2 * state.k - 1);
		}
		result.innerHTML = state.pi;
		count.innerHTML = state.k;
		window.postMessage('fireEvent', "*");
	};
}
*/


///////////////////////////////////
//Avoid State completly - Yield
////////////////////////////

/*
//saving and restoring state - kind of  ugly/overhead etc..
//makes codebase unnatural ..
function computePi() { //most natural, but obviously does not work
	var pi = 0;
	var k;
	for (k = 1; k <= 100000; k++) {
		pi += 4 * Math.pow(-1, k + 1) / (2 * k - 1);
		result.innerHTML = pi;
		count.innerHTML = k;
	}
}
*/




//Yield and Generators
//To create iterations in a natural way.
//generator function can contain a Yield instruction.
//function is suspended and a value can be returned
//function’s state is  automatically preserved by the system and we can restart the function from  the yield instruction as if nothing had happened using next()

/*
function* myGenerator() {
	yield 1;
	yield 2;
	yield 3;	
}

var myNums = myGenerator();

console.log(`next = ${myNums.next()}` ); // {value: 1, done: false}
console.log(`next = ${myNums.next().value}` );
console.log(`next = ${myNums.next().value}` );
console.log(`next = ${myNums.next().value}` );
*/


function* genComputePi() {
	var k;
	var pi = 0;
	for (k = 1; k <= 100000; k++) {
		pi += 4 * Math.pow(-1, k + 1) / (2 * k - 1);
		if (Math.trunc(k / 1000) * 1000 === k) yield pi;
	}
}

function computePiAsync() {
	var computePi = genComputePi();
	var pi;
	function resume() {
		pi = computePi.next();
		//console.log(pi);
		if (!pi.done) {
			result.innerHTML = pi.value;
			setTimeout(resume, 0);
		}
		return;
	}
	setTimeout(resume, 0);
	return;
}

function computePiAsync1() {
	var computePi = genComputePi();
	var pi;
	window.addEventListener("message",resume, false); 
	
	function resume() {
		pi = computePi.next();
		//console.log(pi);
		if (!pi.done) {
			result.innerHTML = pi.value;
			window.postMessage("fireEvent", "*");
		}
		return;
	}
	window.postMessage("fireEvent", "*");
	return;
}

/*
Summary
- If you need to make your own long running functions non-blocking  then you can either use another thread or split the computation into  short sections.
- Threads are more powerful, but not all browsers support them and  they can be difficult to implement.
- The basic idea in creating a non-blocking function without threads is  to make them run in small chunks of time, releasing the UI thread  often enough to keep the UI responsive.
- The main problem is is to keep the state of the computation so that it  can be resumed after it has released the UI thread.
- In most cases you need to write the function using a state object to  record the important information so that the function resumes from  where it left off.
- To schedule the next run of the function you can use setTimeout or  postMessage to place the function on the event queue.
- An alternative way to keep the state of the function is to write it as a  generator and use the yield instruction to pause the function and next  to resume it.
- If you use yield the system will look after the state for you and you  can even pause for loops and generally write the function without  having to worry about restoring state.

*/





///////////////////////////////////////
// Worker Threads
///////////////////////////////////////
/*
//Earlier usecases above are simulated async - breaking up execution in chunks - to free up the UI thread

//AJAX file download - OS is busy scheduling the threads.
//multiple cores - true parallel execution
//Web Workers - Non UI Thread.
//Service Worker - PWA

//Important - 1. what we are not allowed to do 2. Communication between threads

//WW starts  thread automatically and executes js code provided in it constructor
//provide separate file (possible to avoid, but messy and recommended to avoid - BLOB inline worker)
//Keep the worker code as seperate file - keep Execution context separated on to threads.

var worker = new Worker("myScript.js");
//Two things happen
//1. code is loaded and set running a new OS level thread
//2. Worker Object is created on the UI thread - this is used to communicate with the worker thread.

-------------
| UI Thread	|
|	  |		|	 ------------------
|	  |		|	 | Worker Thread  |
|	  V     |    |				  |
|  worker <-|----|-->myScript.js  |
-------------    |      |         |
				 |		V		  |
				 ------------------

//importScripts(script1, script2, ...) Global function to access scripts
//scripts downloaded in any order - but executed in the order provided
//It is a synchronous call.
//web workers - DOM is unavailable. so standard libs might not work.

//Restrictions
// 1. New Thread cannot share anything with the UI Thread. cannot access global objects, dom or the UI in any way.
// 2. Isolated from UI Thread an cannot access any object that are created by UI thread and vice versa
// 3. Primarily to avoid accessing the same object at the same time. (would need locks semaphores, ...race, deadlock etc), maintain data consistency
// 4. WW do have access to all of the global core javascript objects
// 5. WW can access some functions associated with DOM - XMLHttpRequest() setInterval etc.
// 6. If an object is uniique to UI thread or could be shared in anyway with UI Thread, then WW cannot get access to 
it.
// 7. Can access two objects - WorkerNavigator, WorkerLocation 

// Communication is via Events. Both use a method that can cause Events on the other thread.

//UI Thread to Worker Thread//
//Worker Object is created on UI Thread, and has postMessage() method. Triggers message event on the Worker Thread. it is similar to window.postMessage ...
// Worker thread has an event queue of its own. - event driven program of its own
*/

/*
var worker = new Worker("./myScript.js");
worker.postMessage({mydata: "Some Data"});

worker.addEventListener("message", function(event) {
	console.log(`Data from worker ${event.data.mydata}`);
});

//if worker thread is busy in intensive work, message from UI Thread (in the event queue) will be ignored until it reaches the end (of the intensive work)
*/



/*
//pi - with worker
button5.addEventListener("click", function (event) {
	button5.setAttribute("disabled", true);
	var worker  = new Worker("pi.js");
	worker.addEventListener("message", function (event) {
		result.innerHTML=event.data.pi;
		count.innerHTML=event.data.k;
		button5.removeAttribute("disabled");
	});
});
*/

//Periodic Updates - The Event Problem


//To initiate terminate from UI Thread, worker.terminate();


/*
//Asynchronous Worker Thread - Making the worker thread responsive
//Creating and getting data from the WT
var worker = new Worker("pi.js");
worker.addEventListener("message", function (event) {
	if (event.data.value != undefined) {
		result.innerHTML = event.data.value;
	} else {
		worker.postMessage("stop");
	}
		
});

//controlling the WT
worker.postMessage("start");
setInterval(function(){
	worker.postMessage("update");
}, 100);
*/



/*
//Running worker without separate file.
//Using BLOB and Data URL
var workerCodeString = "(" + workerCode.toString() + ")()";
var blob = new Blob([workerCodeString], {type: 'application/javascript'});

var url = URL.createObjectURL(blob);
var worker  = new Worker(url);
worker.addEventListener("message", function (event) {
	if (event.data.value != undefined) {
		result.innerHTML = event.data.value;
	} else {
		worker.postMessage("stop");
	}
		
});

//controlling the WT
worker.postMessage("start");
setInterval(function(){
	worker.postMessage("update");
}, 100);

function workerCode() {
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
	function* genComputePi() {
		var k;
		var pi = 0;
		for (k = 1; k <= 1000000; k++) {
			pi += 4 * Math.pow(-1, k + 1) / (2 * k - 1);
			if (Math.trunc(k / 1000) * 1000 === k) yield pi;
		}
	}

}
*/



/*
//Transferrable Objects

//WT interact/communicate with UT and vice versa using messages
//Data is not shared but copied, it is safe, but for large data it can be slow.
//Object can be owned by only one thread, accessed by it only.
//Object ownership transfer. Passed on to another thread.
//Limited to 3 types of objects, ArrayBuffer, MessagePort, ImageBitMap, potentially large objects
//To send a transferable object, follow the usual data object in postMessage by an array of transferable objects
//IE10 limited to transfering only one Object

//sendMessage(object, [object])
//will transfer object and the event handler will receive the objects as  event.data.
//or
//sendMessage({mydata: object}, [object])

var worker = new Worker("transfer.js");
var arrayBuf = new ArrayBuffer(8);

//getting object back from WT
worker.addEventListener("message", function (event) {
	console.log("UI after return " + event.data.byteLength);
	console.log("UI after return original " + arrayBuf.byteLength);
	//restore the original arrayBuf
	arrayBuf = event.data;
	console.log("UI after restore original " + arrayBuf.byteLength);
});


console.log(`UI before transfer ${arrayBuf.byteLength}`);
worker.postMessage(arrayBuf, [arrayBuf]);
console.log("UI after transfer" + arrayBuf.byteLength);

//Note: The big problem with transferring data is that the thread that owned it  
//originally doesn't get the use of it, not even a copy, while the other thread is  using it.
*/




/*
//SharedWorkers & ServiceWWorkers
//Safari has dropped support for both, ServiceWorkers are being considered.

var worker = new SharedWorker(url);
worker.port.start();
worker.port.sendMessage(data);


//From Shared worker
this.addEventListener("onConnect", function (event) {
	var port =  e.port[0];
	//To send message back to the UI Thread
	port.start();
	port.sendMessage(data);
});
*/

//ServiceWorkers provide facilities that make the offline experience of using a web app  much more like that of a native app.
//ServiceWorker considered as  the future of the web.

/*
Summary:
You can create a Worker object which runs on a different thread to the  UI thread.
- The UI thread doesn't share any objects with the new thread and vice  versa.
- The Worker thread has access to all of JavaScript and a subset of the  global objects available to the UI thread.
- Communication from the thread that created the Worker object to the  new thread makes use of its postMessage method.
- Communication from the Worker thread to the thread that created it  also makes use of the postMesssage method, but of the  DedicatedWorkerGlobalScope object.
- In each case a message event is triggered on the appropriate thread  and the data property of the event object provides the data sent as part  of the message.
- The data transferred to the worker thread and to the UI thread is a  copy, a clone, of the original.
- By limiting the way the thread can interact, the JavaScript  programmer is protected from the main difficulties of multi-threading  and we don't have to worry about locks and race conditions.  ● A big problem with using Worker threads is that communication is  event driven, but the Worker thread is at its most simple when just  ignoring asynchronous considerations and just gets on with the job.
- To allow for responsive communication between the threads both  have to be written in an asynchronous style. Any long running  function in the Worker thread will mean that it doesn't respond to  messages sent to it from the UI thread.
- You can use a Blob object and a Data URL to avoid having to use a  separate file for the Worker's code.
- A faster way to exchange data between threads is to use transferable  objects.
- As well as dedicated Workers you can also create SharedWorkers  which can pass messages between different threads and  ServiceWorkers which make implementing web apps easier. Neither  are supported by Safari. 
*/



//var myPromise =  someAsyncFunc(args);
//myPromise.then(onComplete, onError);

//Promise States 
// 1.pending
// 2.resolved or fulfilled
// 3.rejected

//also, !pending ~ settled


function delay(time, successProb) {
	var promise =  new Promise(
		function (resolve, reject) {
			setTimeout(function () {
				var r =  Math.random();
				if (r > successProb) {
					resolve(r);
				} else {
					reject(r);
				}
			}, time);
		});
	return promise;
}

/*
var promise =  delay(1000, 0.5);
promise.then(
	function (r) {
		console.log("success " + r);
	},
	function (r) {
		console.log("fail " + r);
	});

//How is the above diffrent from a callback?
//someAyncFunc(args, successCallback, errorCallback);
//vs
//someAyncFunc(args).then(successCallback, errorCallback));
*/




/*
//Promises can chain call 
delay(1000, 0)
	.then(function (value) {
					console.log(value);
					return "hello";})
	.then(
		function (value) {
					console.log("xxx " + value);
		});
*/



/*
//Note: if onComplete() fun returns a value, then this value is used as the resolved value of that promise.
//However, if an onComplete() function returns a Promise, then the promise that the then creates has to wait for the first promise to resolve.
//Chain of call will execute sequentially even if it contains non-blocking async functions, as long as they return a promise.

var myPromise1 = delay(1000, 0);
var myPromise2 = myPromise1
	.then(function (value) {
		console.log(value);
		return delay(500,0);
	});
myPromise2.then(function (value) {
	console.log(value);
}); 
*/



/*
//If you chain promises or  async functions using then, they are executed sequentially.
//To make things happen in parallel - no chaining
//If you want to use multiple handlers to the same promise, you can't use chaining.

var p1 = delay(1000, 0);
p1.then(function (value) {
	console.log(value);
});
p1.then(function (value) {
	console.log(20 * value);
});

//vs

p1.then(function (value) {
	console.log(value);
	//return value;
}).then(function (value) {
	console.log(20 * value);
});

*/

//using named functions - helps in error handling
/*
delay(1000,0.5)
	.then(process1,handleError1)
	.then(process2,handleError2) 
*/

/*
//Combining Promises - parallel tasks - Promise.all()
//myTotalPromise will wait untill all the promises are resolved or atleast one is rejected
var myPromise1 = delay(1000, 0);
var myPromise2 = delay(2000, 0);
var myTotalPromise = Promise.all([myPromise1, myPromise2]);
myTotalPromise.then( function(values) {
	console.log(values[0]);
	console.log(values[1]);
});
*/

/*
//Waiting until one of the promises is resolved (or rejected) - Promise.race()
var myPromise1 = delay(1000, .7);
var myPromise2 = delay(3000, .5);
myTotalPromise = Promise.race([myPromise1, myPromise2]);
myTotalPromise.then(
	function (value) {
		console.log("success");
		console.log(value);
	}, 
	function(value) {
		console.log("fail");
		console.log(value);
	}
); 
//note: no way to abort unfinished tasks corrosponding to the Promises that wern't first to get resolved.
//what if you need the first result that is successful? 
//You will have to write the logic yourself... //later
*/

//State flow in chained Promises and Error handling
//recall: myPromise.then(onComplete, onError); //args are optional

//var promise2 = promise1.then(onSuccess1,onFailure1); 
//settlement of promise1 depends on which of onSuccess1 or onFailure1 is executed.
//and what on onSuccess1 or onFailure1 return that determines state of promise2

//no onSuccess or onFailure provided to handle the settlement?
//State is passed to next promise, until there is a handler for that.
//the above applies for exceptions too

/*
promise1.then(onSuccess1)
	.then(onSuccess2,onFailure2)
	.then(onSuccess3);

var promise2 = promise1.then(onSuccess1);
var promise3 = promise2.then(onSuccess2,onFailure2);
var promise4 = promise3.then(onSuccess3);

//Say promise1 is rejected, as there is no onFailure handler, rejection is passed to promise2
//which causes onFailure2 to run.
//Say, onFailure2 returns a value and does not throw exception, promise3 is fulfilled 
//and, on Success3 runs



//Generally, we leave the rejection to be handled at the end.
var promise2 = promise1.then(onSuccess1);
var promise3 = promise2.then(onSuccess2);
var promise4 = promise3.then(onSuccess3);
var promise5 = promise4.then(null,onFailure4); 

//Can be written as 
var promise2 = promise1.then(onSuccess1);
var promise3 = promise2.then(onSuccess2);
var promise4 = promise3.then(onSuccess3);
var promise5 = promise4.catch(onFailure4);
//or Better
promise1.then(onSuccess1)
	.then(onSuccess2)
	.then(onSuccess3)
	.catch(onFailure4);
*/




/*
delay(1000, .5)
	.then(
		function (value) {
			console.log("success1");
			console.log(value);return delay(1000, .5);
		})
	.then(function (value) {
		console.log("success2");
		console.log(value);
	})
	.catch(function (value) {
		console.log("fail");
		console.log(value);
	});
//possibility1: success1, success2
//possibility2: success1, fail
//possibility3: fail
*/

/******
=== Summary - The Then Promise Chain ====
We are now in a position to characterize everything that there is to know  about then and the Promise it returns.  
- The Promise that returns is initially in the pending state and is settled  asynchronously.
- It doesn't matter if the onComplete or the onError handler associated with the  then is called, what happens to the Promise depends on the value returned.  
- If the handler:  
		- returns a value, the Promise returned by then gets resolved with the  returned value as its value;
		- throws an error, the Promise returned by then gets rejected with the  thrown error as its value;
		- returns a resolved Promise, the Promise returned by then gets  resolved with that Promise's value as its value;
		- returns an already rejected Promise, the Promise returned by then gets  rejected with that Promise's value as its value;
		- returns another pending Promise object, the resolution/rejection of the  Promise returned by then will be the same as the resolution/rejection  of the Promise returned by the handler;
		- If there is no handler for the current state of a Promise when it  resolves then that state is passed on to the next Promise in the chain  that has a handler of the appropriate type. 
*****/

/*****
=== Summary: Consuming Promises ===
	- Instead of accepting callbacks, asynchronous functions can and do  return Promises.  
	- You can add the equivalent of onComplete and onError callbacks to  the Promise using the then function.  
	- A Promise object is in one of three states. When it is first created it is  pending. If the task ends correctly then it is in the resolved or fulfilled  state. If the task ends with an error it enters the rejected state.  
	- A Promise is also said to be settled if it isn't pending. When a Promise  is settled it cannot thereafter change its state.  
	- Handlers are called asynchronously when the Promise is settled. Any  handlers that are added after the Promise is settled are also called  asynchronously.  
	- The then function returns a new Promise which is fulfilled if its  onComplete handler returns a value. If its onComplete handler returns  a Promise, this Promise determines the state of the Promise returned  by the then.  
	- Notice that in a chain of Promises the fulfillment state of a Promise  determines which of the handlers it then executes and the result of  the handler determines the state of the Promise that the then returned.  
	- If a suitable handler isn't defined for the Promise then its state is  passed on to the next Promise in the chain in lieu of the state that  would have been determined by the missing handler.  
	- If a handler doesn't throw an exception then the fulfilled state is  passed on to the next Promise in the chain. That is, if the handler  doesn't return a Promise then as long as it hasn't thrown an exception  the next Promise is fulfilled.  
	- If a handler throws an exception then the next Promise in the chain is  rejected.  
	- The catch function can be used to define an onError handler – it is  equivalent to then(null,onError). 

*****/










































