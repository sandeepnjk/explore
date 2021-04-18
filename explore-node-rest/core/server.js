var http =  require('http');
var emp =  require('../controllers/employee');
var settings = require('../settings');

http.createServer(function(req, resp) {

}).listen(settings.webPort, function() {
    console.log(`Started listening on  port ${settings.webPort}`);

    switch (req.method) {
        case "GET":
            if(req.url === '/') {
                resp.end();
            } else if (req.url === '/employees') {
                emp.getList(req, resp);
            }
            break;
        case "POST":

            break;
        case "PUT":

            break;
        case "DELETE":

            break;
        default:
            break;
        
    }
});