document.addEventListener('DOMContentLoaded', () => {
    // 1. Efecto de "Giro" en las tarjetas de actividades con comportamiento responsive
    const cards = document.querySelectorAll('.activity-card');

    // Detectar si es dispositivo móvil/tablet
    function isMobileDevice() {
        return window.innerWidth < 1024;
    }

    cards.forEach(card => {
        let isLocked = false; // Estado de bloqueo para desktop

        // Función para voltear la tarjeta
        function flipCard() {
            card.classList.add('flipped');
        }

        // Función para devolver la tarjeta
        function unflipCard() {
            card.classList.remove('flipped', 'locked');
            isLocked = false;
        }

        // Botón Volver
        const backButton = card.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', function (e) {
                e.stopPropagation();
                unflipCard();
            });
        }

        // Comportamiento según dispositivo
        if (isMobileDevice()) {
            // MÓVIL/TABLET: Solo click para voltear
            card.addEventListener('click', function (e) {
                if (!e.target.classList.contains('back-button')) {
                    if (!card.classList.contains('flipped')) {
                        flipCard();
                    }
                }
            });
        } else {
            // DESKTOP: Hover temporal, click para bloquear

            // Hover: voltear temporalmente
            card.addEventListener('mouseenter', function () {
                if (!isLocked) {
                    flipCard();
                }
            });

            // Mouse sale: volver solo si NO está bloqueada
            card.addEventListener('mouseleave', function () {
                if (!isLocked) {
                    unflipCard();
                }
            });

            // Click: bloquear en estado volteado
            card.addEventListener('click', function (e) {
                if (!e.target.classList.contains('back-button')) {
                    if (card.classList.contains('flipped') && !isLocked) {
                        isLocked = true;
                        card.classList.add('locked');
                    }
                }
            });
        }

        // Reconfigurar event listeners al cambiar tamaño de ventana
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                location.reload(); // Recargar para aplicar el comportamiento correcto
            }, 250);
        });
    });

    // 2. Animación de aparición al hacer Scroll (Intersection Observer)
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Seleccionamos elementos para animar
    document.querySelectorAll('.menu-category, .about-item, .activity-card').forEach(el => {
        observer.observe(el);
    });

    // 3. Transición suave y sutil al cambiar de página - Header fijo
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const destination = link.href;
            if (destination.includes('.html')) {
                e.preventDefault();
                const main = document.querySelector('main');
                const footer = document.querySelector('footer');

                if (main) {
                    main.style.opacity = '0';
                    main.style.transform = 'translateY(-10px)';
                    main.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                }
                if (footer) {
                    footer.style.opacity = '0';
                    footer.style.transition = 'opacity 0.4s ease-out';
                }

                setTimeout(() => {
                    window.location.href = destination;
                }, 400);
            }
        });
    });

    // 4. Actualizar el año del footer automáticamente
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 5. Actualizar botón de autenticación dinámicamente
    const authButton = document.getElementById('auth-button');
    if (authButton) {
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
            };
        }
    }
});