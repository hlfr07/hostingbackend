const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authGuard = require('../middleware/authGuard');

// Solo admin puede acceder a /menu
router.use(authGuard(['admin']));

router.get('/', (req, res) => menuController.showMenu(req, res));
router.post('/toggle-state', (req, res) => menuController.toggleState(req, res));
router.post('/toggle-simple', (req, res) => menuController.toggleSimpleState(req, res));

module.exports = router;