
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {

    res.sendFile(__dirname + '/client/index.html');

});

app.use('/client', express.static(__dirname + '/client'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

serv.listen(9000);

console.log('editor online on port 9000');
