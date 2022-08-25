const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const Todo = require('../models/Todo');
const router = Router();

module.exports = router
  .post('/', authenticate, async (req, res, next) => {
    try {
      const data = await Todo.insert(req.body, req.user.id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      const data = await Todo.getAll(req.user.id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  })
  .put('/:id', authenticate, authorize, async (req, res, next) => {
    try {
      const data = await Todo.updateById(req.params.id, req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });
