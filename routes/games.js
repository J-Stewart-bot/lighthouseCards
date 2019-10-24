/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM games;`)
      .then(data => {
        const games = data.rows;
        res.json({ games });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    let name = req.params.id;
    name = name[0].toUpperCase() + name.slice(1);
    console.log(name);
    db.query(
      `SELECT * FROM games
      WHERE name = $1`, [name])
      .then(data => {
        const game = data.rows[0];
        console.log(data);
        let templateVars = {
          username: req.session.user_id,
          gamename: game.name,
          gameId: game.id,
        };
        res.render(`${req.params.id}`, templateVars);

      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
