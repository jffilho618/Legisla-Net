/* global.js */

// Adiciona os listeners quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Script para o dropdown do perfil ---
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            profileDropdown.classList.toggle('active');
            profileBtn.classList.toggle('active');
        });

        window.addEventListener('click', () => {
            if (profileDropdown.classList.contains('active')) {
                profileDropdown.classList.remove('active');
                profileBtn.classList.remove('active');
            }
        });
    }

    // --- Sistema de navegação com transições ---
    const navLinks = document.querySelectorAll('.nav-item a[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            
            // Atualiza o estado ativo da navegação no menu
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            this.closest('.nav-item').classList.add('active');
            
            // Navega para a página com efeito
            navigateToPage(pageName);
        });
    });
});

// Função de navegação reutilizável
function navigateToPage(pageName) {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    // Adiciona classe para iniciar a animação de saída
    mainContent.classList.add('transitioning');
    
    // Mapeamento de 'data-page' para nomes de arquivo .html
    const pageMap = {
        'dashboard': 'dashboard.html',
        'painel': 'painel_votacao.html',
        'cadastro': 'cadastro_de_pautas.html',
        'nova_pauta': 'nova_pauta.html',
        'editar_pauta': 'editar_pauta.html',
        'vereadores': 'vereadores.html',
        'editar_vereador': 'editar_vereador.html',
        'ordem_do_dia': 'ordem_do_dia.html',
        'relatorio': 'relatorio.html'
    };
    
    const targetUrl = pageMap[pageName] || 'dashboard.html'; // Fallback

    // Após a transição, redireciona para a nova página
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 200); // Metade da duração da transição para um efeito mais rápido
}