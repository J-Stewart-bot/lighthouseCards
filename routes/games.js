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
    db.query(
      `SELECT * FROM games
      WHERE name = $1`, [name])
      .then(data => {
        return data;
      })
      .then(data => {
        db.query(`
        SELECT winners.name as name, COUNT(winners.name) AS wins, game_id
        FROM records
        JOIN winners ON records.id = winners.record_id
        GROUP BY winners.name, game_id
        ORDER BY
          wins DESC;
        `)
        .then(winners => {
          return winners;
        })
        .then(winners => {
          db.query(`
          SELECT losers.name as name, COUNT(losers.name) AS loses, game_id
          FROM records
          JOIN losers ON records.id = losers.record_id
          GROUP BY losers.name, game_id
          ORDER BY
            loses DESC;
          `)
          .then(losers => {
            const winnersRecords = winners.rows;
            const losersRecords = losers.rows;
            const game = data.rows[0];
            let templateVars = {
              username: req.session.user_id,
              gamename: game.name,
              gameId: game.id,
              winnersRecords,
              losersRecords
            };
            res.render(`${name}`, templateVars);
          })
        })
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
