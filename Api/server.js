const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Rotas da nossa API
const authRoutes = require('./src/routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Usar as rotas
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor da API a rodar na porta ${PORT}`);
});