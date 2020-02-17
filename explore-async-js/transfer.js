/*eslint-env es6*/
/*eslint-disable no-console,no-undef, no-unused-vars, no-empty, no-redeclare*/

this.addEventListener("message",  function (event) {
	console.log("Worker got data! " + event.data.byteLength);
	//pass it back to UT
	postMessage(event.data, [event.data]);
	console.log("Worker sent data! " + event.data.byteLength);
}); 