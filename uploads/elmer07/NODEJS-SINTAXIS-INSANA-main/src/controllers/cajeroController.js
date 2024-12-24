class CajeroController {
  showCajero(req, res) {
    res.render('cajero', { 
      user: req.session.user
    });
  }
}

module.exports = new CajeroController();