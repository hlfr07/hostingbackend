const MessageService = require('../services/messageService');

class HomeController {
  constructor() {
    this.messageService = new MessageService();
  }

  showHome(req, res) {
    const message = this.messageService.getMessage();
    res.render('home', { message });
  }
}

module.exports = new HomeController();