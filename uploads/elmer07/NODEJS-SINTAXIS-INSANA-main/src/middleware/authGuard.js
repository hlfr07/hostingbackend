function authGuard(roles = []) {
  return (req, res, next) => {
    if (!req.session.token || !req.session.user) {
      return res.redirect('/auth/login');
    }

    // Si no se especifican roles, permitir acceso
    if (roles.length === 0) {
      return next();
    }

    // Verificar rol
    const userRole = req.session.user.role;
    if (roles.includes(userRole) || userRole === 'admin') {
      next();
    } else {
      res.status(403).send('Acceso no autorizado');
    }
  };
}

module.exports = authGuard;