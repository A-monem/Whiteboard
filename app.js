var http = require("http");
var fs = require("fs")

var server = http.createServer(function (req, res) {
    if (req.url === "/") {
        fs.readFile("./index.html", function (error, data) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        });
    } else if (req.url.match("\.css$")) {
        fs.readFile("./assets/css/whiteboard.css", function (error, data) {
            res.writeHead(200, { "Content-Type": "text/css" });
            res.write(data);
            res.end();
        });
    } else if (req.url.match("\.js$")) {
        fs.readFile("./assets/js/whiteboard.js", function (error, data) {
            res.writeHead(200, { "Content-Type": "text/javascript" });
            res.write(data);
            res.end();
        });
    } else if (req.url.match("\.png$")) {
        fs.readFile("./assets/imgs/GO-logo.png", function (error, data) {
            res.writeHead(200, { "Content-Type": "image/png" });
            res.write(data);
            res.end();
        });
    } else if (req.url.match("\.json$")) {
        fs.readFile("./IDs.json", function (error, data) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(data);
            res.end();
        });
    } else if (req.method === "POST") {
        let data = new Object;
        req.on('data', function (chunk) {
            data = chunk;
        });
        req.on('end', function () {
            data = JSON.parse(data)
            writeJSON(data.market, data.day, data.id);
        })
        res.end();
    } else if (req.method === "DELETE") {
        let data = new Object;
        req.on('data', function (chunk) {
            data = chunk;
        });
        req.on('end', function () {
            data = JSON.parse(data)
            deleteJSON(data.market, data.day, data.id);
        })
        res.end();
    }
});

server.listen(3000, function () {
    console.log("server started")
});


function writeJSON(market, day, id) {
    fs.readFile("./IDs.json", function (error, data) {
        data = JSON.parse(data);
        (data[market][day]).push(id);
        data = JSON.stringify(data, null, 4);
        fs.writeFile("./IDs.json", data, function () {
            console.log("data written");
        })
    });
};

function deleteJSON(market, day, id) {
    fs.readFile("./IDs.json", function (error, data) {
        data = JSON.parse(data);
        (data[market][day]).splice((data[market][day]).indexOf(id), 1)
        data = JSON.stringify(data, null, 4);
        fs.writeFile("./IDs.json", data, function () {
            console.log("data deleted");
        })
    });
};