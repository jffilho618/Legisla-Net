const { createClient } = require('@supabase/supabase-js');
const { validationResult } = require('express-validator');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const handleLogin = async (req, res) => {
    console.log('🔐 === INÍCIO DO PROCESSO DE LOGIN ===');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('❌ Erros de validação:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('📧 Email recebido:', email);

    try {
        console.log('🚀 Tentando autenticar com Supabase...');
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            console.log('❌ Erro de autenticação do Supabase:', authError.message);
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const user = authData.user;
        console.log('✅ Usuário autenticado com sucesso! ID:', user.id);

        console.log('🔍 Buscando perfil na tabela profiles...');
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role, nome, camara_id')
            .eq('id', user.id)
            .single();

        // MODIFICADO: Lógica de criação de perfil foi removida.
        // Agora, se o perfil não for encontrado, o processo para com um erro 404.
        if (profileError || !profileData) {
            console.log('❌ Perfil não encontrado para o usuário ID:', user.id);
            console.log('   (Erro do Supabase, se houver):', profileError);
            return res.status(404).json({ error: 'Perfil de usuário não encontrado.' });
        }
        
        console.log('✅ Perfil encontrado:', profileData);
        console.log('🏆 Login concluído com sucesso!');
        
        return res.status(200).json({
            message: 'Login bem-sucedido!',
            user: {
                id: user.id,
                email: user.email,
                nome: profileData.nome,
                role: profileData.role,
                camara_id: profileData.camara_id
            },
            token: authData.session.access_token
        });

    } catch (error) {
        console.error('💥 ERRO INESPERADO NO CONTROLLER:', error);
        return res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
    }
};

module.exports = {
    handleLogin,
};