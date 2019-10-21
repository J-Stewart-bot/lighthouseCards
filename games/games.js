const Goofspiel = require('./goofspiel/goofspiel');

const games = {};
let game;
let io;

const onConnect = function(socket) {
  if(game === undefined) {
    game = new Goofspiel();
  }

  socket.on('username', function(username) {
    socket.username = username;
    socket.card = undefined;
    socket.score = 0;
    if (game.getPlayerOne === undefined) {
      console.log('p1');
      game.setGameId(socket.id);
      game.setPlayerOne(socket);
      socket.gameId = game.gameId;
      socket.playerOne = true;
    } else {
      console.log('p2');
      game.setPlayerTwo(socket);
      socket.gameId = game.gameId;
      socket.turn = game.gameId;
      game.getPlayerOne.turn = socket.id;
      io.to(`${game.getPlayerOne.id}`).emit('prize', game.newPrize());
      io.to(`${game.getPlayerTwo.id}`).emit('prize', game.getCurrentPrize);
      io.to(`${game.getPlayerOne.id}`).emit('turn', username);

      games[game.gameId] = Object.assign( Object.create( Object.getPrototypeOf(game)), game);
      game = undefined;
    }
  });

  socket.on('turn', function(username, card) {

    if (games[socket.gameId].getPlayerOne.card === undefined) {
      games[socket.gameId].getPlayerOne.card = card;
    } else if (games[socket.gameId].getPlayerTwo.card === undefined) {
      if (games[socket.gameId].getPlayerOne.card > card) {
        games[socket.gameId].getPlayerOne.score += games[socket.gameId].getCurrentPrize;
        io.to(`${games[socket.gameId].getPlayerOne.id}`).emit('score', games[socket.gameId].getPlayerOne.score, games[socket.gameId].getPlayerTwo.score);
        io.to(`${games[socket.gameId].getPlayerTwo.id}`).emit('score', games[socket.gameId].getPlayerTwo.score, games[socket.gameId].getPlayerOne.score);

      } else if (games[socket.gameId].getPlayerOne.card < card) {
        games[socket.gameId].getPlayerTwo.score += games[socket.gameId].getCurrentPrize;
        io.to(`${games[socket.gameId].getPlayerOne.id}`).emit('score', games[socket.gameId].getPlayerOne.score, games[socket.gameId].getPlayerTwo.score);
        io.to(`${games[socket.gameId].getPlayerTwo.id}`).emit('score', games[socket.gameId].getPlayerTwo.score, games[socket.gameId].getPlayerOne.score);
      } else {
        games[socket.gameId].getPlayerOne.score += games[socket.gameId].getCurrentPrize / 2;
        games[socket.gameId].getPlayerTwo.score += games[socket.gameId].getCurrentPrize / 2;
        io.to(`${games[socket.gameId].getPlayerOne.id}`).emit('score', games[socket.gameId].getPlayerOne.score, games[socket.gameId].getPlayerTwo.score);
        io.to(`${games[socket.gameId].getPlayerTwo.id}`).emit('score', games[socket.gameId].getPlayerTwo.score, games[socket.gameId].getPlayerOne.score);
      }
      games[socket.gameId].getPlayerOne.card = undefined;
      if (!games[socket.gameId].gameOver()) {
        io.to(`${games[socket.gameId].getPlayerOne.id}`).emit('prize', games[socket.gameId].newPrize());
        io.to(`${games[socket.gameId].getPlayerTwo.id}`).emit('prize', games[socket.gameId].getCurrentPrize);
      } else {
        if (games[socket.gameId].getPlayerOne.score > games[socket.gameId].getPlayerTwo.score) {
          io.to(`${games[socket.gameId].getPlayerOne.id}`).emit('score', 'winner', 'loser');
          io.to(`${games[socket.gameId].getPlayerTwo.id}`).emit('score', 'loser', 'winner');
        } else {
          io.to(`${games[socket.gameId].getPlayerOne.id}`).emit('score', 'loser', 'winner');
          io.to(`${games[socket.gameId].getPlayerTwo.id}`).emit('score', 'winner', 'loser');
        }
      }
    }
    socket.broadcast.to(socket.turn).emit('turn', username);
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
