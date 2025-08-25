// ==========================================
// SERVIDOR DE DEBUG PARA DIAGNOSTICAR O 404
// ==========================================

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// ==========================================
// SISTEMA DE LOGS DETALHADO
// ==========================================
const createLogger = (context) => {
    return {
        log: (...args) => console.log(`[${context}]`, new Date().toISOString(), ...args),
        error: (...args) => console.error(`[${context} ERROR]`, new Date().toISOString(), ...args)
    };
};

const serverLogger = createLogger('SERVER');
const routeLogger = createLogger('ROUTES');
const middlewareLogger = createLogger('MIDDLEWARE');

// ==========================================
// INTERCEPTADOR DE TODAS AS REQUISIÇÕES
// ==========================================
function createRequestInterceptor() {
    return (req, res, next) => {
        const startTime = Date.now();
        middlewareLogger.log(`🟦 REQUISIÇÃO RECEBIDA: ${req.method} ${req.url}`);
        middlewareLogger.log(`   Headers:`, JSON.stringify(req.headers, null, 2));
        middlewareLogger.log(`   Body:`, req.body);
        middlewareLogger.log(`   Query:`, req.query);
        middlewareLogger.log(`   Params:`, req.params);
        
        // Interceptar resposta
        const originalSend = res.send;
        const originalJson = res.json;
        
        res.send = function(data) {
            const duration = Date.now() - startTime;
            middlewareLogger.log(`🟩 RESPOSTA ENVIADA: ${res.statusCode} (${duration}ms)`);
            middlewareLogger.log(`   Data:`, data);
            originalSend.call(this, data);
        };
        
        res.json = function(data) {
            const duration = Date.now() - startTime;
            middlewareLogger.log(`🟩 RESPOSTA JSON: ${res.statusCode} (${duration}ms)`);
            middlewareLogger.log(`   Data:`, JSON.stringify(data, null, 2));
            originalJson.call(this, data);
        };
        
        next();
    };
}

// ==========================================
// MOSTRAR TODAS AS ROTAS REGISTRADAS
// ==========================================
function showRegisteredRoutes(app) {
    serverLogger.log('🔍 === ROTAS REGISTRADAS NO EXPRESS ===');
    
    function printRoutes(routes, prefix = '') {
        routes.forEach((route, index) => {
            if (route.route) {
                // Rota direta
                const methods = Object.keys(route.route.methods).join(', ').toUpperCase();
                serverLogger.log(`   ${index + 1}. ${methods} ${prefix}${route.route.path}`);
            } else if (route.name === 'router') {
                // Sub-router
                let routerPrefix = route.regexp.source;
                // Limpar regex para mostrar path limpo
                routerPrefix = routerPrefix
                    .replace(/^\^\\?/, '')
                    .replace(/\$.*/, '')
                    .replace(/\\\//g, '/')
                    .replace(/\(\?\:\[\^\\\/\]\+\)\?\$/g, '');
                
                serverLogger.log(`   📁 ROUTER: ${routerPrefix}`);
                if (route.handle && route.handle.stack) {
                    printRoutes(route.handle.stack, routerPrefix);
                }
            } else {
                serverLogger.log(`   ${index + 1}. MIDDLEWARE: ${route.name || 'anonymous'}`);
            }
        });
    }
    
    if (app._router && app._router.stack) {
        serverLogger.log(`📊 Total de middlewares/rotas: ${app._router.stack.length}`);
        printRoutes(app._router.stack);
    } else {
        serverLogger.error('❌ Nenhuma rota encontrada no stack do Express!');
    }
}

// ==========================================
// MIDDLEWARE 404 PERSONALIZADO
// ==========================================
function create404Handler() {
    return (req, res, next) => {
        middlewareLogger.error(`❌ 404 NOT FOUND: ${req.method} ${req.url}`);
        middlewareLogger.error(`   Esta rota não foi encontrada no Express`);
        middlewareLogger.error(`   Verifique se a rota foi registrada corretamente`);
        
        res.status(404).json({
            error: 'Rota não encontrada',
            method: req.method,
            url: req.url,
            timestamp: new Date().toISOString(),
            debug: 'Middleware 404 personalizado - rota não existe'
        });
    };
}

// ==========================================
// SERVIDOR PRINCIPAL
// ==========================================
const app = express();
const PORT = process.env.PORT || 3001;

serverLogger.log('🚀 === INICIANDO SERVIDOR DE DEBUG ===');

// 1. Middleware de debug (PRIMEIRO DE TODOS)
serverLogger.log('1️⃣ Registrando interceptador de requisições...');
app.use(createRequestInterceptor());

// 2. Middlewares padrão
serverLogger.log('2️⃣ Registrando CORS...');
app.use(cors());

serverLogger.log('3️⃣ Registrando express.json...');
app.use(express.json());

// 3. Tentar importar e registrar rotas de autenticação
serverLogger.log('4️⃣ Tentando importar rotas de autenticação...');
try {
    const authRoutes = require('./src/routes/auth');
    serverLogger.log('✅ AuthRoutes importado com sucesso!');
    serverLogger.log('   Tipo:', typeof authRoutes);
    serverLogger.log('   É função?', typeof authRoutes === 'function');
    
    if (authRoutes && authRoutes.stack) {
        serverLogger.log('   Stack encontrado com', authRoutes.stack.length, 'rota(s)');
    }
    
    serverLogger.log('5️⃣ Registrando rotas em /api/auth...');
    app.use('/api/auth', authRoutes);
    serverLogger.log('✅ Rotas registradas com sucesso!');
    
} catch (error) {
    serverLogger.error('❌ ERRO AO IMPORTAR ROTAS:', error);
    serverLogger.error('Stack:', error.stack);
}

// 4. Arquivos estáticos (DEPOIS das rotas da API)
serverLogger.log('6️⃣ Registrando arquivos estáticos...');
app.use(express.static(path.join(__dirname, 'web')));

// 5. Mostrar todas as rotas registradas
showRegisteredRoutes(app);

// 6. Middleware 404 (ÚLTIMO)
serverLogger.log('7️⃣ Registrando handler 404...');
app.use(create404Handler());

// 7. Middleware de erro global
app.use((error, req, res, next) => {
    serverLogger.error('💥 ERRO GLOBAL:', error);
    res.status(500).json({
        error: 'Erro interno do servidor',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
});

// 8. Iniciar servidor
app.listen(PORT, () => {
    serverLogger.log('🎯 === SERVIDOR INICIADO COM SUCESSO ===');
    serverLogger.log(`🌐 URL: http://localhost:${PORT}`);
    serverLogger.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    serverLogger.log('📝 Agora faça uma requisição POST para /api/auth/login');
    serverLogger.log('🔍 Todos os logs serão mostrados aqui');
});