-- Drop and recreate Records table

DROP TABLE IF EXISTS records CASCADE;
CREATE TABLE records (
  id SERIAL PRIMARY KEY NOT NULL,
  winner VARCHAR(255) NOT NULL,
  loser VARCHAR(255) NOT NULL,
  game_id INTEGER REFERENCES games(id) ON DELETE CASCADE
);


