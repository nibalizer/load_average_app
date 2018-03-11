
// Load Config File
var config = require('./config.json');

// Load libraries; instantiate express app and socket.io
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');


var load_avg = "dummy";

// Serve any files in the 'vendor' directory as static resources
// This is where js libraries for the client are stored
app.use(express.static('vendor'))

// Serve index.html on /
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/load_number', function(req, res){
  res.send(load_avg);
});

app.get('/load_number_animated', function(req, res){
  res.sendFile(__dirname + '/load_number_animated.html');
});

app.get('/load_graph', function(req, res){
  res.sendFile(__dirname + '/load_graph.html');
});

// Start the web server on port 3000
http.listen(3001, function(){
  console.log('listening on *:3001');
});

// Setup a websocket with any web client that connects
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

setInterval( function() {
  fs.readFile('/proc/loadavg', {encoding: 'utf-8'}, function(err,data){
    console.log(data);
    load_1min = parseFloat(data.split(" ")[0]);
    resp = {}
    resp["load_1min"] = load_1min

    load_avg = data;
    io.emit('timeseries data', resp);
  });
}, 1000);
