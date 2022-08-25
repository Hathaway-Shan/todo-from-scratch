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
  static async getAll(id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM todos
      WHERE user_id = $1`,
      [id]
    );
    return rows.map((row) => new Todo(row));
  }
  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM todos
      WHERE id = $1`,
      [id]
    );
    if (!rows[0]) return null;
    return new Todo(rows[0]);
  }
  static async updateById(id, data) {
    const oldData = await Todo.getById(id);
    const newData = {
      ...oldData,
      ...data,
    };
    const { rows } = await pool.query(
      `
      UPDATE todos
      SET user_id = $1, content = $2, finished = $3
      WHERE id = $4
      RETURNING *`,
      [newData.user_id, newData.content, newData.finished, id]
    );
    return new Todo(rows[0]);
  }
};
