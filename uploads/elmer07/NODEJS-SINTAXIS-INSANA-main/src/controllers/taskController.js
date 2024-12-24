const TaskService = require('../services/taskService');

class TaskController {
  constructor() {
    this.taskService = new TaskService();
  }

  getAllTasks(req, res) {
    const tasks = this.taskService.getAllTasks();
    const state = req.session.state || { filter: 'all' };
    res.render('tasks', { tasks, state });
  }

  createTask(req, res) {
    const { title } = req.body;
    this.taskService.createTask(title);
    res.redirect('/');
  }

  updateState(req, res) {
    const { filter } = req.body;
    req.session.state = { ...req.session.state, filter };
    res.redirect('/');
  }
}

module.exports = new TaskController();