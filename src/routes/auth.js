const express = require('express');
const router = express.Router();

// Certifique-se de que o caminho para o controller está correto
const authController = require('../controllers/authController');

// Define a rota de login
router.post('/login', authController.handleLogin);

// Podem ser adicionadas outras rotas aqui no futuro, como /register, /logout, etc.

module.exports = router;
