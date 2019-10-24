const Goofspiel = require('./goofspiel/goofspiel');
const War = require('./war/war');
const Speed = require('./speed/speed');

const games = {};
let io;

const onConnect = function(socket) {
  socket.on('username', function(username, gamename) {
    socket.username = username;
    socket.card = undefined;
    socket.bet = [];
    socket.score = 0;

    for (const game in games) {
      if (games[game].getPlayerOne.disconnected) {
        delete games[game];
      } else if (games[game].getPlayerTwo === undefined && gamename === games[game].gamename) {
        console.log('p2');
        games[game].setPlayerTwo(socket);
        socket.gameId = games[game].gameId;
        socket.turn = games[game].gameId;
        games[game].getPlayerOne.turn = socket.id;

        games[game].start(io);

        // game = undefined;
      }
    }
    if (!socket.gameId) {
      let game;

      if (gamename === 'Goofspiel') {
        game = new Goofspiel();
      } else if (gamename === 'War') {
        game = new War();
      } else if (gamename === 'Speed') {
        game = new Speed();
      }

      console.log('p1');
      game.setGameId(socket.id);
      game.setPlayerOne(socket);
      socket.gameId = game.gameId;

      games[game.gameId] = Object.assign(Object.create(Object.getPrototypeOf(game)), game);
    }
  });

  socket.on('start', function() {
    games[socket.gameId].bothReady(io);
  });

  socket.on('pickup', function() {
    games[socket.gameId].pickUp(io, socket);
  });

  socket.on('turn', function(card, display) {
    games[socket.gameId].takeTurn(io, socket, card, display);
  });

  socket.on('inProgress', function(data, callback) {
    if (data !== null) {
      games[socket.gameId].gameOver(io, socket);
    } else {
      callback(games[socket.gameId].inProgress);
    }
  });

  socket.on('left', function(username) {
    console.log(username, 'has left');

    if (games[socket.gameId].getPlayerOne && games[socket.gameId].getPlayerTwo) {
      games[socket.gameId].left(io, socket);
    } else {
      delete games[socket.gameId];

      io.to(socket.id).emit('exit');
    }
  });
};

const listenForConnection = function(inOut) {
  io = inOut;
  io.on('connect', onConnect);
};

module.exports = listenForConnection;
