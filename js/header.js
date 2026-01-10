// Header dinámico para todas las páginas de Beach Club
(function () {
    'use strict';

    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertHeader);
    } else {
        insertHeader();
    }

    function insertHeader() {
        // Determinar la página activa
        const currentPath = window.location.pathname;
        const activePage = getActivePage(currentPath);

        // HTML del header (sin espacios en blanco al inicio)
        const headerHTML = `<header>
  <a href="zona-privada.html" class="login-button" id="auth-button">🔐 Login</a>
  <nav>
    <div class="logo">
      <a href="index.html">
        <img src="assets/logo.png" alt="Beach Club Logo">
      </a>
    </div>
    <button class="hamburger" id="hamburger-menu" aria-label="Menu">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <ul id="nav-menu">
      <li><a href="index.html"${activePage === 'index' ? ' class="active"' : ''}>Inicio</a></li>
      <li><a href="menu.html"${activePage === 'menu' ? ' class="active"' : ''}>Menú</a></li>
      <li><a href="actividades.html"${activePage === 'actividades' ? ' class="active"' : ''}>Actividades</a></li>
      <li><a href="facturas.html"${activePage === 'facturas' ? ' class="active"' : ''}>Facturas</a></li>
    </ul>
  </nav>
</header>`;

        // Crear el header y insertarlo
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = headerHTML.trim();
        const headerElement = tempDiv.firstElementChild; // Usar firstElementChild en lugar de firstChild

        if (headerElement) {
            // Insertar al principio del body
            if (document.body.firstChild) {
                document.body.insertBefore(headerElement, document.body.firstChild);
            } else {
                document.body.appendChild(headerElement);
            }

            // Actualizar botón de auth después de un pequeño delay
            setTimeout(updateAuthButton, 0);

            // Configurar hamburger menu
            setupHamburgerMenu();
        }
    }

    function getActivePage(path) {
        if (path.includes('index.html') || path.endsWith('/')) return 'index';
        if (path.includes('menu.html')) return 'menu';
        if (path.includes('actividades.html')) return 'actividades';
        if (path.includes('facturas.html')) return 'facturas';
        if (path.includes('calculadora.html')) return 'calculadora';
        if (path.includes('lista-compra.html')) return 'lista-compra';
        if (path.includes('zona-privada.html')) return 'zona-privada';
        return 'index';
    }

    function updateAuthButton() {
        const authButton = document.getElementById('auth-button');
        if (!authButton) {
            console.warn('Auth button not found');
            return;
        }

        const isAuth = localStorage.getItem('beachclub_auth') === 'true';
        const currentPage = window.location.pathname;

        // Solo mostrar "Cerrar Sesión" en páginas privadas
        const isPrivatePage = currentPage.includes('calculadora.html') ||
            currentPage.includes('lista-compra.html') ||
            currentPage.includes('zona-privada.html');

        if (isAuth && isPrivatePage) {
            authButton.textContent = '🔓 Cerrar Sesión';
            authButton.href = '#';
            authButton.onclick = function (e) {
                e.preventDefault();
                if (typeof logout === 'function') {
                    logout();
                } else {
                    localStorage.removeItem('beachclub_auth');
                    window.location.href = 'index.html';
                }
            }
        };
    }

    function setupHamburgerMenu() {
        const hamburger = document.getElementById('hamburger-menu');
        const navMenu = document.getElementById('nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function () {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            // Cerrar menú al hacer click en un enlace
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function () {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
        }
    }
})();
