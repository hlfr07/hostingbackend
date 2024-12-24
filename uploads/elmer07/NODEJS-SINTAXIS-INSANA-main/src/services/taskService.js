class TaskService {
  constructor() {
    this.tasks = [];
  }

  getAllTasks() {
    return this.tasks;
  }

  createTask(title) {
    const task = {
      id: Date.now(),
      title,
      completed: false
    };
    this.tasks.push(task);
    return task;
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
    }
    return task;
  }
}

module.exports = TaskService;