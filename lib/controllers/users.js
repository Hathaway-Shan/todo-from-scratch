const { Router } = require('express');
const UserService = require('../services/UserService');
const router = Router();

module.exports = router.post('/', async (req, res, next) => {
  try {
    const data = await UserService.create(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
});
