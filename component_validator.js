// ==========================================
// VALIDADOR DE COMPONENTES INDIVIDUAIS
// ==========================================

const fs = require('fs');
const path = require('path');

// ==========================================
// TESTE 1: VALIDAÇÃO DO AUTHCONTROLLER
// ==========================================
function testAuthController() {
    console.log('\n=== TESTE 1: VALIDAÇÃO DO AUTHCONTROLLER ===');
    
    try {
        // Simular environment variables se necessário
        if (!process.env.SUPABASE_URL) {
            console.log('AVISO: SUPABASE_URL não definida, definindo mock para teste');
            process.env.SUPABASE_URL = 'https://mock.supabase.co';
        }
        if (!process.env.SUPABASE_ANON_KEY) {
            console.log('AVISO: SUPABASE_ANON_KEY não definida, definindo mock para teste');
            process.env.SUPABASE_ANON_KEY = 'mock-key';
        }
        
        const authController = require('./src/controllers/authController');
        console.log('✓ authController importado com sucesso');
        console.log('Tipo:', typeof authController);
        console.log('Exportações:', Object.keys(authController));
        console.log('handleLogin é função?', typeof authController.handleLogin === 'function');
        
        return { success: true, controller: authController };
    } catch (error) {
        console.log('✗ Erro ao importar authController:', error.message);
        console.log('Stack:', error.stack);
        return { success: false, error };
    }
}

// ==========================================
// TESTE 2: VALIDAÇÃO DAS ROTAS DE AUTH
// ==========================================
function testAuthRoutes() {
    console.log('\n=== TESTE 2: VALIDAÇÃO DAS ROTAS DE AUTH ===');
    
    try {
        const authRoutes = require('./src/routes/auth');
        console.log('✓ authRoutes importado com sucesso');
        console.log('Tipo:', typeof authRoutes);
        console.log('É função?', typeof authRoutes === 'function');
        
        // Verificar se é um router do Express
        if (authRoutes && authRoutes.stack) {
            console.log('✓ Stack de rotas encontrado com', authRoutes.stack.length, 'entrada(s)');
            
            authRoutes.stack.forEach((layer, index) => {
                console.log(`Rota ${index + 1}:`);
                console.log('  - Path:', layer.regexp.source);
                console.log('  - Métodos:', layer.route ? Object.keys(layer.route.methods) : 'N/A');
                console.log('  - Handler name:', layer.handle.name || 'anonymous');
            });
        } else {
            console.log('? Stack de rotas não encontrado diretamente');
        }
        
        return { success: true, routes: authRoutes };
    } catch (error) {
        console.log('✗ Erro ao importar authRoutes:', error.message);
        console.log('Stack:', error.stack);
        return { success: false, error };
    }
}

// ==========================================
// TESTE 3: TESTE DE INTEGRAÇÃO MÍNIMA
// ==========================================
function testMinimalIntegration() {
    console.log('\n=== TESTE 3: INTEGRAÇÃO MÍNIMA ===');
    
    try {
        const express = require('express');
        const app = express();
        
        console.log('✓ Express app criado');
        
        // Tentar registrar as rotas
        const authRoutes = require('./src/routes/auth');
        app.use('/api/auth', authRoutes);
        console.log('✓ Rotas registradas em /api/auth');
        
        // Verificar rotas registradas
        if (app._router && app._router.stack) {
            console.log('Stack do app:', app._router.stack.length, 'entrada(s)');
            
            app._router.stack.forEach((layer, index) => {
                console.log(`Layer ${index + 1}:`);
                console.log('  - Regexp:', layer.regexp.source);
                console.log('  - Name:', layer.name);
                
                if (layer.handle && layer.handle.stack) {
                    console.log('  - Sub-rotas:', layer.handle.stack.length);
                    layer.handle.stack.forEach((subLayer, subIndex) => {
                        const methods = subLayer.route ? Object.keys(subLayer.route.methods).join(',') : 'unknown';
                        const path = subLayer.route ? subLayer.route.path : subLayer.regexp.source;
                        console.log(`    ${subIndex + 1}. ${methods.toUpperCase()} ${path}`);
                    });
                }
            });
        }
        
        return { success: true, app };
    } catch (error) {
        console.log('✗ Erro na integração:', error.message);
        return { success: false, error };
    }
}

// ==========================================
// TESTE 4: VALIDAÇÃO DE DEPENDÊNCIAS
// ==========================================
function testDependencies() {
    console.log('\n=== TESTE 4: VALIDAÇÃO DE DEPENDÊNCIAS ===');
    
    const dependencies = [
        'express',
        'cors',
        '@supabase/supabase-js',
        'express-validator',
        'dotenv'
    ];
    
    const results = {};
    
    dependencies.forEach(dep => {
        try {
            const module = require(dep);
            console.log(`✓ ${dep}: OK`);
            results[dep] = { success: true, version: module.version || 'unknown' };
        } catch (error) {
            console.log(`✗ ${dep}: ERRO - ${error.message}`);
            results[dep] = { success: false, error: error.message };
        }
    });
    
    return results;
}

// ==========================================
// TESTE 5: VALIDAÇÃO DE ARQUIVOS
// ==========================================
function testFileStructure() {
    console.log('\n=== TESTE 5: ESTRUTURA DE ARQUIVOS ===');
    
    const files = [
        { path: './src/controllers/authController.js', required: true },
        { path: './src/routes/auth.js', required: true },
        { path: './web/index.html', required: false },
        { path: './.env', required: false },
        { path: './package.json', required: true },
        { path: './node_modules/express', required: true }
    ];
    
    files.forEach(file => {
        try {
            const exists = fs.existsSync(file.path);
            const stats = exists ? fs.statSync(file.path) : null;
            const status = exists ? '✓' : (file.required ? '✗' : '?');
            
            console.log(`${status} ${file.path}: ${exists ? 'EXISTS' : 'MISSING'}`);
            
            if (exists && stats) {
                console.log(`  - Tamanho: ${stats.size} bytes`);
                console.log(`  - Modificado: ${stats.mtime.toISOString()}`);
                
                // Para arquivos JS, verificar conteúdo básico
                if (file.path.endsWith('.js') && stats.size > 0) {
                    const content = fs.readFileSync(file.path, 'utf8');
                    console.log(`  - Linhas: ${content.split('\n').length}`);
                    console.log(`  - Contém require: ${content.includes('require(') ? 'SIM' : 'NÃO'}`);
                    console.log(`  - Contém module.exports: ${content.includes('module.exports') ? 'SIM' : 'NÃO'}`);
                }
            }
        } catch (error) {
            console.log(`✗ ${file.path}: ERRO - ${error.message}`);
        }
    });
}

// ==========================================
// EXECUÇÃO PRINCIPAL
// ==========================================
function runAllTests() {
    console.log('==========================================');
    console.log('VALIDADOR DE COMPONENTES INDIVIDUAIS');
    console.log('==========================================');
    
    const results = {
        dependencies: testDependencies(),
        fileStructure: testFileStructure(),
        authController: testAuthController(),
        authRoutes: testAuthRoutes(),
        integration: testMinimalIntegration()
    };
    
    console.log('\n=== RESUMO DOS TESTES ===');
    console.log('AuthController:', results.authController.success ? '✓ OK' : '✗ FALHA');
    console.log('AuthRoutes:', results.authRoutes.success ? '✓ OK' : '✗ FALHA');
    console.log('Integração:', results.integration.success ? '✓ OK' : '✗ FALHA');
    
    if (!results.authController.success) {
        console.log('\n❌ PROBLEMA CRÍTICO: AuthController não pode ser carregado');
        console.log('Solução sugerida: Verificar sintaxe e dependências do authController.js');
    }
    
    if (!results.authRoutes.success) {
        console.log('\n❌ PROBLEMA CRÍTICO: Rotas de autenticação não podem ser carregadas');
        console.log('Solução sugerida: Verificar sintaxe e importações em auth.js');
    }
    
    if (results.authController.success && results.authRoutes.success && !results.integration.success) {
        console.log('\n❌ PROBLEMA CRÍTICO: Componentes individuais funcionam, mas integração falha');
        console.log('Solução sugerida: Verificar configuração do Express no server.js');
    }
    
    return results;
}

// Executar automaticamente se for chamado diretamente
runAllTests();