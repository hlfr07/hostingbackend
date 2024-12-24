const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/', (req, res) => taskController.getAllTasks(req, res));
router.post('/tasks', (req, res) => taskController.createTask(req, res));
router.post('/state', (req, res) => taskController.updateState(req, res));

module.exports = router;