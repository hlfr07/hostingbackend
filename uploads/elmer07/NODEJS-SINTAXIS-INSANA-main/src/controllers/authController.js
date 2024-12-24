const jwt = require('jsonwebtoken');

const users = {
  'luis07': { password: '123456', role: 'admin' },
  'lucia05': { password: '12345', role: 'cajero' }
};

class AuthController {
  showLogin(req, res) {
    res.render('login', { error: null });
  }

  login(req, res) {
    const { username, password } = req.body;
    const user = users[username];

    if (user && user.password === password) {
      // Generar token con rol
      const token = jwt.sign(
        { username, role: user.role }, 
        'secreto-jwt', 
        { expiresIn: '1h' }
      );
      
      // Guardar en sesión
      req.session.token = token;
      req.session.user = { username, role: user.role };

      // Redirigir según rol
      if (user.role === 'cajero') {
        res.redirect('/cajero');
      } else {
        res.redirect('/menu');
      }
    } else {
      res.render('login', { error: 'Credenciales inválidas' });
    }
  }

  logout(req, res) {
    req.session.destroy();
    res.redirect('/auth/login');
  }
}

module.exports = new AuthController();