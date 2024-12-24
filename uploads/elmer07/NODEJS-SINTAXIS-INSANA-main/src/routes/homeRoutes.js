const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', (req, res) => homeController.showHome(req, res));

module.exports = router;