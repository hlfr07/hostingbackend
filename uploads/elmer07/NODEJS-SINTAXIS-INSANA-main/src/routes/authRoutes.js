const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', (req, res) => authController.showLogin(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/logout', (req, res) => authController.logout(req, res));

module.exports = router;