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
    db.query(`
      SELECT winners.name as name, COUNT(winners.name) AS wins, COUNT(losers.name) as loses, game_id
      FROM records
      JOIN winners ON records.id = winners.record_id
      JOIN losers ON records.id = losers.record_id
      GROUP BY winners.name, game_id
      ORDER BY
        wins DESC;
      `)
      .then(data => {
        const records = data.rows;
        let templateVars = {
          username: req.session.user_id,
          gamename: '',
          records
        };
        res.render('../views/records', templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    db.query(
      `SELECT * FROM records
      WHERE winner = $1`, [req.params.id])
      .then(data => {
        const record = data.rows;
        res.json({ record });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    db.query(`
      INSERT INTO records (game_id)
      VALUES ($1)
      RETURNING *;
      `, [req.body.gameId])
      .then(res => {
        return res.rows[0].id
      })
      .then(res => {
        for (const winner of req.body.winners) {
          db.query(`
            INSERT INTO winners (name, record_id)
            VALUES ($1, $2)
          `, [winner, res])
        }

        return res;
      })
      .then(res => {
        for (const loser of req.body.losers) {
          db.query(`
            INSERT INTO losers (name, record_id)
            VALUES ($1, $2)
          `, [loser, res])
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};

