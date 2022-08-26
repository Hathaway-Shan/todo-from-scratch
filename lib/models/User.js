const pool = require('../utils/pool');

module.exports = class User {
  id;
  first_name;
  last_name;
  email;
  #passwordHash;

  constructor(row) {
    this.id = row.id;
    this.first_name = row.first_name;
    this.last_name = row.last_name;
    this.email = row.email;
    this.#passwordHash = row.password_hash;
  }
  static async insert({ first_name, last_name, email, passwordHash }) {
    const { rows } = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password_hash)
      values ($1, $2, $3, $4)
      returning *`,
      [first_name, last_name, email, passwordHash]
    );

    return new User(rows[0]);
  }
  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = $1
      `,
      [email]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }
  get passwordHash() {
    return this.#passwordHash;
  }
};
