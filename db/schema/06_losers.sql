-- Drop and recreate Games table

DROP TABLE IF EXISTS losers CASCADE;
CREATE TABLE losers (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  record_id INTEGER REFERENCES records(id) ON DELETE CASCADE
);
