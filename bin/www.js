const app = require('../app');
const debug = require('debug')('simul-doc-be:server');
const http = require('http');
// temporary while playing with sockets
//-------------------------------------------------
const socket = require('socket.io');
//-------------------------------------------------

function normalizePort(val) {
  const port = Number(val);
  if (port >= 0) {
    return port;
  }
  return false;
}

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
// temporary while playing with sockets
//-------------------------------------------------
const io = socket(server);
//-------------------------------------------------
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// temporary while playing with sockets
//-------------------------------------------------
let total = 0;
io.on('connection', (connectedSocket) => {
  total += 1;
  // emit to connected
  connectedSocket.emit(
    'newConnection',
    { text: `hi from backend, u are ${total} user that currently connected` },
  );
  // emit to others
  connectedSocket.broadcast.emit(
    'newConnection',
    { text: `new user connected, total users:${total}` },
  );

  connectedSocket.on('login', (data) => {
    console.log(`login event emited, passed value is ${data}`);
  });

  connectedSocket.on('disconnect', () => {
    total -= 1;
    connectedSocket.broadcast.emit(
      'lostConnection',
      { text: `user disconnected, total users:${total}` },
    );
  });
});
//-------------------------------------------------
