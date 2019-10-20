const Goofspiel = require('./goofspiel/goofspiel');

const game = new Goofspiel();
let io;

const onConnect = function(socket) {

  // if (game.getPlayerOne === undefined) {
  // } else if (game.getPlayerTwo === undefined) {
  // } else {
  //   console.log('Game full!');
  // }

  socket.on('username', function(username) {
    socket.username = username;
    socket.score = 0;
    if (game.getPlayerOne === undefined) {
      console.log('p1');
      game.setPlayerOne(socket);
    } else {
      console.log('p2');
      game.setPlayerTwo(socket);
      io.emit('prize', game.newPrize());
      socket.broadcast.emit('turn', username);
    }
  });

  socket.on('turn', function(username, card) {
    if (game.getPlayerOne.card === undefined) {
      game.getPlayerOne.card = card;
    } else if (game.getPlayerTwo.card === undefined) {
      if (game.getPlayerOne.card > card) {
        game.getPlayerOne.score += game.getCurrentPrize;
        io.to(`${game.getPlayerOne.id}`).emit('score', game.getPlayerOne.score, game.getPlayerTwo.score);
        io.to(`${game.getPlayerTwo.id}`).emit('score', game.getPlayerTwo.score, game.getPlayerOne.score);

      } else if (game.getPlayerOne.card < card) {
        game.getPlayerTwo.score += game.getCurrentPrize;
        io.to(`${game.getPlayerOne.id}`).emit('score', game.getPlayerOne.score, game.getPlayerTwo.score);
        io.to(`${game.getPlayerTwo.id}`).emit('score', game.getPlayerTwo.score, game.getPlayerOne.score);
      } else {
        game.getPlayerOne.score += game.getCurrentPrize / 2;
        game.getPlayerTwo.score += game.getCurrentPrize / 2;
        io.to(`${game.getPlayerOne.id}`).emit('score', game.getPlayerOne.score, game.getPlayerTwo.score);
        io.to(`${game.getPlayerTwo.id}`).emit('score', game.getPlayerTwo.score, game.getPlayerOne.score);
      }
      game.getPlayerOne.card = undefined;
      if (!game.gameOver()) {
        io.emit('prize', game.newPrize());
      } else {
        if (game.getPlayerOne.score > game.getPlayerTwo.score) {
          io.to(`${game.getPlayerOne.id}`).emit('score', 'winner', 'loser');
          io.to(`${game.getPlayerTwo.id}`).emit('score', 'loser', 'winner');
        } else {
          io.to(`${game.getPlayerOne.id}`).emit('score', 'loser', 'winner');
          io.to(`${game.getPlayerTwo.id}`).emit('score', 'winner', 'loser');
        }
      }
    }
    socket.broadcast.emit('turn', username);
  })

  socket.on('chat_message', function(message) {
    io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
  });

};

const listenForConnection = function(inOut) {
  io = inOut;
  io.on('connect', onConnect);
}

module.exports = listenForConnection;
