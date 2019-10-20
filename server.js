// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const http       = require('http').Server(app);
const io         = require('socket.io')(http);
const morgan     = require('morgan');

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

//Our routes
const gamesRoutes = require("./routes/games");
const recordsRoutes = require("./routes/records");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above
app.use("/games", gamesRoutes(db));
app.use("/records", recordsRoutes(db));


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  let templateVars = {
    username: req.session.user_id
  };
  res.render("index", templateVars);
});

app.post('/login', (req, res) => {
  req.session.user_id = req.body.username;
  res.redirect('/');
})

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
})

let p1;
let p2;

const prizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
let value = Math.round(Math.random() * (prizes.length - 1));
let currentPrize = prizes[value];
prizes.splice(value, 1);

const onConnect = function(socket) {
  socket.on('username', function(username) {
    socket.username = username;
    if (p1 === undefined) {
      console.log('p1');
      p1 = socket;
    } else {
      console.log('p2');
      p2 = socket;
    }
    io.emit('prize', currentPrize);
    socket.broadcast.emit('turn', username);
  });

  socket.on('turn', function(username, card) {
    if (p1.card === undefined) {
      p1.card = card;
    } else if (p2.card === undefined) {
      if (p1.card > card) {
        io.to(`${p1.id}`).emit('win', currentPrize);
      } else if (p1.card < card) {
        io.to(`${p2.id}`).emit('win', currentPrize);
      } else {
        io.emit('split');
      }
      p1.card = undefined;
      value = Math.round(Math.random() * (prizes.length - 1));
      currentPrize = prizes[value];
      prizes.splice(value, 1);
      io.emit('prize', currentPrize);
    }
    socket.broadcast.emit('turn', username);
  })

  socket.on('chat_message', function(message) {
    io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
  });

};

io.on('connect', onConnect);

http.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
