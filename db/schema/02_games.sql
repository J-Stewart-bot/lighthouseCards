-- Drop and recreate Games table

DROP TABLE IF EXISTS games CASCADE;
CREATE TABLE games (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  number_of_players SMALLINT NOT NULL DEFAULT 2
);
