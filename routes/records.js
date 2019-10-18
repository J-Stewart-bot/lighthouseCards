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
    db.query(`SELECT * FROM records;`)
      .then(data => {
        const records = data.rows;
        res.json({ records });
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
