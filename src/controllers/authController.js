const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (authError) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const user = authData.user;

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError || !profileData) {
            return res.status(404).json({ error: 'Perfil de usuário não encontrado.' });
        }
        
        res.status(200).json({
            message: 'Login bem-sucedido!',
            role: profileData.role,
            token: authData.session.access_token
        });

    } catch (error) {
        console.error('Erro no handleLogin:', error);
        res.status(500).json({ error: 'Ocorreu um erro no servidor.' });
    }
};

module.exports = {
    handleLogin,
};