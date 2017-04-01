var path    = require('path'),
	express = require('express'),
		app = express(),
	 server = require('http').createServer(app),
   socketIO	= require('socket.io').listen(server);


//routes
var index = require('./routes/index');

//service
var socketService = require('./service/socketService');

//port
var port = process.env.PORT || 8080;

//start listening
server.listen(port,function(){
	console.log('Server started at',port);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);

//global variable
users={};
sockets = socketIO.sockets;

//get the connection event
sockets.on('connection',socketService.onConnection);




