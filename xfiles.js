#!/usr/bin/env node

var path = require('path'),
	express = require('express'),
	contentDisposition = require('content-disposition'),
	pkg = require(path.join(__dirname, 'package.json')),
	scan = require('./scan'),
	program = require('commander');



program.version(pkg.version);
program.option('-p, --port <port>', 'Port to listen to (defaults to 8080)', parseInt);
program.parse(process.argv);

var port = program.port || 8080;

var tree = scan('.', 'files');

var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));


app.use('/files', express.static(process.cwd(), {
    index: false,
    setHeaders: function(res, path){

        // Set header to force files to download

        res.setHeader('Content-Disposition', contentDisposition(path))

    }
}));


app.get('/scan', function (req, res) {
	res.send(tree);
});

app.listen(port);

console.log("Listening to port: " + port);