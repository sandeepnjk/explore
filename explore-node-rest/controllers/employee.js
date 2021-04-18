var db = require('../core/db');

exports.getList = function (req, response) {
    db.executeSql(
        'select * from emp', 
        function (data, err) {
            if(err) {
                response.writeHead(
                                500, 
                                "Internal error occured", 
                                {"Content-Type": "text/html"});
                response.write(`<html>500<title></title><body>500: Internal Error. Details: ${err}</body></html>`);
            } else {
                response.writeHead(
                    200,  
                    {"Content-Type": "application/json"});
                response.write(JSON.stringify(data));
            }
            response.end();
        });
};

exports.get =  function (req, resp, empNo) {

};

exports.add =  function(req, resp, reqBody) {

};

exports.update =  function(req, resp, reqBody) {

};

exports.delete =  function(req, resp, empNo) {

};