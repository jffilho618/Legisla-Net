const express = require('express');
const cors = require('cors');
const path = require('path'); // Módulo essencial para lidar com caminhos de ficheiros
require('dotenv').config();

// As rotas agora são importadas a partir da pasta 'src' na raiz
const authRoutes = require('./src/routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// --- CORREÇÃO: SERVIR FICHEIROS ESTÁTICOS ---
// Esta linha diz ao Express para tratar a pasta 'web' como o diretório
// principal do seu site. Qualquer pedido será procurado aqui primeiro.
app.use(express.static(path.join(__dirname, 'web')));

// --- ROTAS DA API ---
// Adicionamos o prefixo '/api' para evitar conflitos.
// O login agora será em 'http://localhost:3000/api/auth/login'
app.use('/api/auth', authRoutes);


// --- ROTA "CATCH-ALL" ---
// Se um pedido não corresponder a uma rota da API nem a um ficheiro
// na pasta 'web', esta rota servirá a página principal (index.html).
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'index.html'));
});


app.listen(PORT, () => {
    console.log(`Servidor a rodar em http://localhost:${PORT}`);
});
