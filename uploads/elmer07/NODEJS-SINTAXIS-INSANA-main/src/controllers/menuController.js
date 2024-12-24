class MenuController {
  showMenu(req, res) {
    // Inicializar estados si no existen
    if (!req.session.showMessage) {
      req.session.showMessage = false;
    }
    if (!req.session.showSimpleMessage) {
      req.session.showSimpleMessage = false;
    }
    
    res.render('menu', { 
      user: req.session.user,
      showMessage: req.session.showMessage,
      showSimpleMessage: req.session.showSimpleMessage
    });
  }

  toggleState(req, res) {
    req.session.showMessage = !req.session.showMessage;
    res.redirect('/menu');
  }

  // Versión simplificada del toggle
  toggleSimpleState(req, res) {
    req.session.showSimpleMessage = !req.session.showSimpleMessage;
    res.redirect('/menu');
  }
}

module.exports = new MenuController();