const socket = require('socket.io');
const JsDiff = require('diff');

const Document = require('../models/document');

function listenSocket(server) {
  const io = socket(server);
  io.on('connection', (connectedSocket) => {
    connectedSocket.on('joinedRoom', (data) => {
      // didint find more elegant solution to leave previous room
      const oldRooms = Object.keys(connectedSocket.rooms);
      connectedSocket.leave(oldRooms);
      connectedSocket.join(data.id);
    });

    connectedSocket.on('documentEdited', (data) => {
      Document.findById(data.id)
        .then(result => JsDiff.applyPatch(result.content, data.content))
        .then((updated) => {
          Document.findByIdAndUpdate(data.id, { content: updated })
            .then(() => {
              connectedSocket.to(data.id).broadcast.emit(
                'documentEdited',
                { text: data.content },
              );
            });
        });
    });
  });
}

module.exports = {
  listenSocket,
};
