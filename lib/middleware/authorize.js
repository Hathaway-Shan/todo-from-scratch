const Todo = require('../models/Todo');

module.exports = async (req, res, next) => {
  try {
    const data = await Todo.getById(req.params.id);
    if (req.user.id !== data.user_id)
      throw new Error('You are not authorized to complete this action');
    next();
  } catch (error) {
    error.status = 403;
    next(error);
  }
};
