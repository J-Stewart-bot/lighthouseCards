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
    games[socket.gameId].takeTurn(io, socket, username, card);
  })


};

const listenForConnection = function(inOut) {
  io = inOut;
  io.on('connect', onConnect);
}

module.exports = listenForConnection;
