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
      SELECT winner AS name, COUNT(winner) AS wins
      FROM records
      GROUP BY winner
      ORDER BY winner;
      `)
      .then(data => {
        const records = data.rows;
        console.log(data);
        let templateVars = {
          username: req.session.user_id,
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
        // res.render("../views/index");
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};

router.post("/", (req, res) => {
  console.log(req.body);
  db.query(`
    INSERT INTO records (winner, loser, game_id)
    VALUES ($1, $2, $3)
    RETURNING *;
    `, [req.body.winner, req.body.loser, req.body.gameId])
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});
