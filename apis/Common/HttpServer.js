var app   = require('../app');
var debug = require('debug')('demo:server');
var http  = require('http');

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof httpPort === 'string'
    ? 'Pipe ' + httpPort
    : 'Port ' + httpPort;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

var server;

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('HTTP Listening on ' + bind);
}

var CreateHttpServer = function(httpPort) {
  server = http.createServer(app.callback());
  server.listen(httpPort);
  server.on('error', onError);
  server.on('listening', onListening);
}

exports.Create = CreateHttpServer;