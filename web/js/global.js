/*
 * global.js (Versão Modularizada)
 * Este script gerencia o carregamento de componentes de layout,
 * navegação, e interações globais da UI.
 */

// ===================================================================================
// FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO DO LAYOUT
// ===================================================================================

/**
 * Inicializa o layout da página, carregando os componentes corretos (sidebar, header, etc.)
 * e configurando os listeners de eventos necessários.
 * @param {object} pageConfig - Objeto de configuração da página.
 * @param {string} pageConfig.title - O título a ser exibido no cabeçalho.
 * @param {string} pageConfig.icon - A classe do ícone Font Awesome para o cabeçalho.
 * @param {string} pageConfig.navActive - O ID do item de navegação a ser marcado como ativo.
 */
async function initLayout(pageConfig) {
    const path = window.location.pathname;

    // Determina o contexto (admin, app ou portal) com base no caminho do URL
    if (path.includes('/admin/')) {
        await loadComponent('../components/admin_sidebar.html', 'sidebar-placeholder');
        await loadComponent('../components/admin_header.html', 'header-placeholder');
    } else if (path.includes('/app/')) {
        await loadComponent('../components/app_sidebar.html', 'sidebar-placeholder');
        await loadComponent('../components/app_header.html', 'header-placeholder');
    } else if (path.includes('/portal/')) {
        await loadComponent('../components/portal_navbar.html', 'navbar-placeholder');
        await loadComponent('../components/portal_footer.html', 'footer-placeholder');
    }

    // Após carregar os componentes, configura os elementos dinâmicos
    setupDynamicContent(pageConfig);
    setupEventListeners();
}


// ===================================================================================
// FUNÇÕES AUXILIARES DE CARREGAMENTO E CONFIGURAÇÃO
// ===================================================================================

/**
 * Carrega um componente HTML de um arquivo e o injeta em um elemento alvo.
 * @param {string} componentPath - Caminho para o arquivo HTML do componente.
 * @param {string} targetElementId - ID do elemento onde o componente será inserido.
 */
async function loadComponent(componentPath, targetElementId) {
    const targetElement = document.getElementById(targetElementId);
    if (!targetElement) return; // Não faz nada se o placeholder não existir

    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Componente não encontrado: ${componentPath}`);
        }
        targetElement.innerHTML = await response.text();
    } catch (error) {
        console.error('Erro ao carregar componente:', error);
        targetElement.innerHTML = `<p style="color:red;">Erro ao carregar componente: ${componentPath}</p>`;
    }
}

/**
 * Configura o conteúdo dinâmico da página, como título do cabeçalho e item de navegação ativo.
 * @param {object} pageConfig - Objeto de configuração da página.
 */
function setupDynamicContent(pageConfig) {
    if (!pageConfig) return;

    // Define o título e o ícone do cabeçalho, se existirem
    const headerTitle = document.getElementById('header-title');
    const headerIcon = document.getElementById('header-icon');
    if (headerTitle && pageConfig.title) {
        headerTitle.textContent = pageConfig.title;
    }
    if (headerIcon && pageConfig.icon) {
        headerIcon.className = `fa-solid ${pageConfig.icon}`;
    }

    // Define o item de navegação ativo na sidebar
    if (pageConfig.navActive) {
        const activeNavItem = document.getElementById(pageConfig.navActive);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    }
}

/**
 * Configura todos os event listeners globais após o carregamento dos componentes.
 * Isso garante que os botões e links dentro dos componentes funcionem corretamente.
 */
function setupEventListeners() {
    // Listener para o dropdown do perfil de usuário
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            profileDropdown.classList.toggle('active');
            profileBtn.classList.toggle('active');
        });
    }

    // Listener para fechar o dropdown ao clicar fora
    window.addEventListener('click', () => {
        if (profileDropdown && profileDropdown.classList.contains('active')) {
            profileDropdown.classList.remove('active');
            profileBtn.classList.remove('active');
        }
    });

    // Listeners para os links de navegação da sidebar
    const navLinks = document.querySelectorAll('a[data-page]');
    navLinks.forEach(link => {
        // Remove listeners antigos para evitar duplicação, se houver
        link.replaceWith(link.cloneNode(true));
    });
    // Adiciona os novos listeners
    document.querySelectorAll('a[data-page]').forEach(link => {
         link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            navigateToPage(pageName);
        });
    });

    // Animações de fade-in
    initializeFadeInObserver();
}

// ===================================================================================
// LÓGICA DE NAVEGAÇÃO (ADAPTADA DO SEU ARQUIVO ORIGINAL)
// ===================================================================================

function isAdminContext() {
    return window.location.pathname.includes('/admin/');
}

function navigateToPage(pageName) {
    const mainContent = document.getElementById('mainContent');
    const targetUrl = getPageUrl(pageName);

    if (!targetUrl) {
        console.warn(`URL não encontrada para a página: ${pageName}`);
        return;
    }

    if (mainContent) {
        mainContent.classList.add('transitioning');
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 200);
    } else {
        window.location.href = targetUrl;
    }
}

function getPageUrl(pageName) {
    const relativePath = isAdminContext() ? '' : '../admin/';
    
    const pageMap = {
        // Admin pages
        'dashboard_admin': `${relativePath}dashboard_admin.html`,
        'nova-camara': `${relativePath}nova_camara.html`,
        // App pages
        'dashboard': '../app/dashboard.html',
        'cadastro': '../app/cadastro_de_pautas.html',
        'nova_pauta': '../app/nova_pauta.html',
        'editar_pauta': '../app/editar_pauta.html',
        'vereadores': '../app/vereadores.html',
        'editar_vereador': '../app/editar_vereador.html',
        'ordem_do_dia': '../app/ordem_do_dia.html',
        'relatorio': '../app/relatorio.html',
        'perfil': '../app/perfil_camara.html',
        'sessoes': '../app/nova_sessao.html',
    };
    
    // Adapta a chave de busca para o contexto admin
    const key = isAdminContext() && pageName === 'dashboard' ? 'dashboard_admin' : pageName;

    return pageMap[key];
}


// ===================================================================================
// ANIMAÇÕES (ADAPTADO DO SEU ARQUIVO ORIGINAL)
// ===================================================================================

function initializeFadeInObserver() {
    const elementsToFadeIn = document.querySelectorAll('.fade-in');
    if (elementsToFadeIn.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elementsToFadeIn.forEach(el => observer.observe(el));
}

// Adiciona um listener global que espera o DOM carregar, mas não inicia o layout.
// O layout será iniciado por uma chamada explícita em cada página HTML.
document.addEventListener('DOMContentLoaded', () => {
    // Funções que não dependem de componentes podem ser chamadas aqui,
    // mas a maioria agora está em setupEventListeners().
});
