const express = require('express');
const router = express.Router();
const cajeroController = require('../controllers/cajeroController');
const authGuard = require('../middleware/authGuard');

// Cajeros y admins pueden acceder a /cajero
router.use(authGuard(['cajero', 'admin']));

router.get('/', (req, res) => cajeroController.showCajero(req, res));

module.exports = router;