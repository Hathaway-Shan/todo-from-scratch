const pool = require('../utils/pool');

module.exports = class Todo {
  id;
  user_id;
  content;
  finished;

  constructor({ id, user_id, content, finished }) {
    this.id = id;
    this.user_id = user_id;
    this.content = content;
    this.finished = finished;
  }
  static async insert({ content }, user_id) {
    const { rows } = await pool.query(
      `
      INSERT INTO todos
      (user_id, content)
      VALUES ($1, $2)
      RETURNING *`,
      [user_id, content]
    );
    return new Todo(rows[0]);
  }
};
