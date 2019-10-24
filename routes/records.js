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
          let templateVars = {
            username: req.session.user_id,
            gamename: '',
            winnersRecords,
            losersRecords
          };
          res.render('../views/records', templateVars);
        })
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    db.query(
      `SELECT
        winners.name as winner,
        losers.name as loser,
        games.name as game,
        records.date as date
      FROM games
      JOIN records ON games.id = game_id
      JOIN winners ON records.id = winners.record_id
      JOIN losers ON records.id = losers.record_id
      WHERE
        winners.name LIKE $1 OR
        losers.name LIKE $1`, [req.params.id])
      .then(data => {
        const records = data.rows;
        let templateVars = {
          username: req.session.user_id,
          gamename: '',
          records
        };
        res.render('../views/records_player', templateVars);
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
        return res.rows[0].id;
      })
      .then(res => {
        if (req.body.winners !== undefined) {
          let query = `
            INSERT INTO winners (name, record_id)
            VALUES`;
          let values = [];
          for (const win in req.body.winners) {
            values.push(`($${Number(win) + 1}, $${req.body.winners.length + 1})`);
          }

          values = values.join(', ');

          query = query.concat(' ', values);
          query += ';';

          const someValue = req.body.winners;
          someValue.push(res);

          db.query(query, someValue)
            .then(res => {
            })
            .catch(err => {
              console.log(err);
            });
        }
        return res;
      })
      .then(res => {
        if (req.body.losers.length > 0) {
          let query = `
            INSERT INTO losers (name, record_id)
            VALUES`;
          let values = [];
          for (const win in req.body.losers) {
            values.push(`($${Number(win) + 1}, $${req.body.losers.length + 1})`);
          }

          values = values.join(', ');

          query = query.concat(' ', values);
          query += ';';

          const someValue = req.body.losers;
          someValue.push(res);

          db.query(query, someValue)
            .then(res => {
            })
            .catch(err => {
              console.log(err);
            });
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

