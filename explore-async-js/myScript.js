/*eslint-env es6*/
/*eslint-disable no-console,no-undef, no-unused-vars, no-empty, no-redeclare*/

//Listening for messages posted from UI Thread
this.addEventListener("message", function (event) {
	console.log(`checking ${event.data.mydata}`);
});

//passing message to UI Thread
this.postMessage({mydata: "Some data from worker"});

