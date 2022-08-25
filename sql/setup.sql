-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS todos CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name TEXT,
  last_name TEXT, 
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE todos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL,
  content TEXT NOT NULL,
  finished BOOLEAN DEFAULT 'false',
  FOREIGN KEY (user_id) REFERENCES users(id)
);
