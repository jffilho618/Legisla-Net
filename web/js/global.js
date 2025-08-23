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
    // CORREÇÃO: Caminhos alterados para absolutos
    if (path.includes('/admin/')) {
        await loadComponent('/components/admin_sidebar.html', 'sidebar-placeholder');
        await loadComponent('/components/admin_header.html', 'header-placeholder');
    } else if (path.includes('/app/')) {
        await loadComponent('/components/app_sidebar.html', 'sidebar-placeholder');
        await loadComponent('/components/app_header.html', 'header-placeholder');
    } else if (path.includes('/portal/')) {
        await loadComponent('/components/portal_navbar.html', 'navbar-placeholder');
        await loadComponent('/components/portal_footer.html', 'footer-placeholder');
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
    // CORREÇÃO: Caminhos alterados para absolutos
    const pageMap = {
        // Admin pages
        'dashboard_admin': '/admin/dashboard_admin.html',
        'nova-camara': '/admin/nova_camara.html',
        // App pages
        'dashboard': '/app/dashboard.html',
        'cadastro': '/app/cadastro_de_pautas.html',
        'nova_pauta': '/app/nova_pauta.html',
        'editar_pauta': '/app/editar_pauta.html',
        'vereadores': '/app/vereadores.html',
        'editar_vereador': '/app/editar_vereador.html',
        'ordem_do_dia': '/app/ordem_do_dia.html',
        'relatorio': '/app/relatorio.html',
        'perfil': '/app/perfil_camara.html',
        'sessoes': '/app/nova_sessao.html',
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

/**
 * Sistema Unificado de Animações Fade-In
 * Suporta: .fade-in, .animate-on-load, .fade-in-section
 */
function initUnifiedAnimations() {
    // 1. Animações imediatas (hero sections)
    const immediateElements = document.querySelectorAll('.animate-on-load');
    immediateElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, (index + 1) * 200);
    });

    // 2. Animações durante scroll (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Para de observar após animar
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Ativa um pouco antes
    });

    // Observar todos os tipos de elementos
    const scrollElements = document.querySelectorAll('.fade-in, .fade-in-section');
    scrollElements.forEach(el => observer.observe(el));
}

// Manter compatibilidade com código existente
function initFadeInAnimations() {
    initUnifiedAnimations();
}

// Adiciona um listener global que espera o DOM carregar, mas não inicia o layout.
// O layout será iniciado por uma chamada explícita em cada página HTML.
document.addEventListener('DOMContentLoaded', () => {
    // Funções que não dependem de componentes podem ser chamadas aqui,
    // mas a maioria agora está em setupEventListeners().
});


// ===================================================================================
// INICIALIZADOR DE COMPONENTES DE UI (ex: Dropdowns de Tabela)
// ===================================================================================

/**
 * Inicializa a interatividade para os dropdowns de status encontrados na página.
 * Procura por elementos com a classe '.status-dropdown' e adiciona os listeners.
 */
function initStatusDropdowns() {
    const statusDropdowns = document.querySelectorAll('.status-dropdown');
    if (statusDropdowns.length === 0) return;

    const closeAllDropdowns = (exceptThisOne = null) => {
        document.querySelectorAll('.status-dropdown.open').forEach(dropdown => {
            if (dropdown !== exceptThisOne) {
                dropdown.classList.remove('open');
            }
        });
    };

    statusDropdowns.forEach(dropdown => {
        const badgeWrapper = dropdown.querySelector('.status-badge-wrapper');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        if (!badgeWrapper || !dropdownMenu) return;

        badgeWrapper.addEventListener('click', (event) => {
            event.stopPropagation();
            const wasOpen = dropdown.classList.contains('open');
            closeAllDropdowns();
            if (!wasOpen) {
                dropdown.classList.add('open');
            }
        });

        dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                const newValue = item.getAttribute('data-value');
                const newText = item.textContent;
                const mainBadge = dropdown.querySelector('.status-badge-wrapper .status-badge');
                if (mainBadge) {
                    mainBadge.className = 'status-badge'; // Limpa classes antigas
                    mainBadge.classList.add(newValue);
                    mainBadge.textContent = newText.toUpperCase();
                }
                console.log(`Status alterado para: ${newValue}`);
            });
        });
    });

    window.addEventListener('click', () => {
        closeAllDropdowns();
    });
}
