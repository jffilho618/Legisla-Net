const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

router.post(
    '/login',
    body('email', 'O email é inválido').isEmail(),
    body('password', 'A senha não pode estar em branco').notEmpty(),
    authController.handleLogin
);

module.exports = router;