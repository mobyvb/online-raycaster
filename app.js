
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var http = http.Server(app);
var io = require('socket.io')(http);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var wallGrid;
var players = [];
app.get('/', function(req, res) {
  res.render('index', {grid:wallGrid});
});

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('moved', function(x, y) {
    socket.broadcast.emit('movement', socket.id, x, y);
  });
});

http.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  createNewGame();
});

function createNewGame() {
  wallGrid = new Uint8Array(32 * 32);
  for (var i = 0; i < 32*32; i++) {
    wallGrid[i] = Math.random() < 0.3 ? 1 : 0;
  }
}
