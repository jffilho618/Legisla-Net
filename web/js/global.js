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
    // MODIFICAÇÃO: Agora seleciona TODOS os links com o atributo 'data-page',
    // incluindo o novo link "Meu Perfil" no dropdown.
    const navLinks = document.querySelectorAll('a[data-page]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            
            // Apenas atualiza o estado 'active' se o link estiver na sidebar principal
            if (this.closest('.nav-item')) {
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                this.closest('.nav-item').classList.add('active');
            }
            
            // Navega para a página com efeito
            navigateToPage(pageName);
        });
    });
});

// Função para detectar se estamos no contexto administrativo
function isAdminContext() {
    // Verifica se há badge de administrador na página
    const adminBadge = document.querySelector('.admin-badge');
    // Ou verifica se o URL atual contém páginas administrativas
    const currentPage = window.location.pathname;
    const adminPages = ['dashboard_admin.html', 'nova_camara.html', 'gerenciar_camara.html'];
    
    return adminBadge || adminPages.some(page => currentPage.includes(page));
}

// Função de navegação reutilizável
function navigateToPage(pageName) {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) {
        // Se não houver 'mainContent' (ex: página de login), faz o redirecionamento direto
        const targetUrl = getPageUrl(pageName);
        if (targetUrl) {
            window.location.href = targetUrl;
        }
        return;
    }

    mainContent.classList.add('transitioning');
    
    const targetUrl = getPageUrl(pageName);

    setTimeout(() => {
        if (targetUrl) {
            window.location.href = targetUrl;
        }
    }, 200);
}

// Função auxiliar para mapear o nome da página para a URL
function getPageUrl(pageName) {
    // Mapas de páginas separados para contextos diferentes
    const adminPageMap = {
        'dashboard': 'dashboard_admin.html',
        'nova-camara': 'nova_camara.html',
        'configuracoes': 'configuracoes_admin.html',
        'relatorios': 'relatorios_admin.html',
        'perfil': 'perfil_admin.html'
    };

    const clientPageMap = {
        'dashboard': 'dashboard.html',
        'painel': 'painel_votacao.html',
        'cadastro': 'cadastro_de_pautas.html',
        'nova_pauta': 'nova_pauta.html',
        'editar_pauta': 'editar_pauta.html',
        'vereadores': 'vereadores.html',
        'editar_vereador': 'editar_vereador.html',
        'ordem_do_dia': 'ordem_do_dia.html',
        'relatorio': 'relatorio.html',
        'perfil': 'perfil_camara.html',
        'sessoes': 'nova_sessao.html'
    };

    // Escolhe o mapa apropriado baseado no contexto
    const pageMap = isAdminContext() ? adminPageMap : clientPageMap;
    
    // Fallback para o dashboard apropriado
    const defaultPage = isAdminContext() ? 'dashboard_admin.html' : 'dashboard.html';
    
    return pageMap[pageName] || defaultPage;
}

// --- Script para Animação Fade-in com Intersection Observer ---
const elementsToFadeIn = document.querySelectorAll('.fade-in');

if (elementsToFadeIn.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe que torna o elemento visível
                entry.target.classList.add('visible');
                // Para de observar o elemento após a animação para economizar recursos
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // A animação dispara quando 10% do elemento está visível
    });

    // Inicia a observação para cada elemento com a classe .fade-in
    elementsToFadeIn.forEach(el => observer.observe(el));
}