document.addEventListener('DOMContentLoaded', () => {

    /*  ==========================================================================
        1. VARIABLES GLOBALES Y NAVEGACIÓN MÓVIL
        ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const logo = document.querySelector('.logo-pop');
    const appWrapper = document.getElementById('app-wrapper');
    const marqueeContainer = document.querySelector('.marquee-container');

    // NUEVO: Seleccionamos el nuevo botón del Hero para móviles
    const mobileViewProjectsBtn = document.getElementById('mobileViewProjectsBtn');

    // Menú móvil
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.add('active'));
    }

    // NUEVO: Le decimos al nuevo botón que también abra el menú
    if (mobileViewProjectsBtn && mobileMenu) {
        mobileViewProjectsBtn.addEventListener('click', () => mobileMenu.classList.add('active'));
    }

    if (closeMobileMenu && mobileMenu) {
        closeMobileMenu.addEventListener('click', () => mobileMenu.classList.remove('active'));
    }
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('active'));
    });

    // Efecto "PLOP" para el logo
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            logo.animate([{
                    transform: 'scale(1) rotate(0deg)'
                },
                {
                    transform: 'scale(1.3) rotate(-5deg)'
                },
                {
                    transform: 'scale(1.1) rotate(3deg)'
                },
                {
                    transform: 'scale(1.2) rotate(-2deg)'
                }
            ], {
                duration: 400,
                easing: 'ease-out',
                fill: 'forwards'
            });
        });

        logo.addEventListener('mouseleave', () => {
            logo.style.transition = "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            logo.style.transform = "scale(1) rotate(0deg)";
        });
    }

    /*  ==========================================================================
        2. REVEAL AL HACER SCROLL (Aparecer suavemente)
        ========================================================================== */
    const revealOnScroll = () => {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };

    if (appWrapper) {
        appWrapper.addEventListener('scroll', revealOnScroll);
    }
    revealOnScroll(); // Ejecutar al cargar

    /*  ==========================================================================
        3. MARQUEE INTERACTIVO (HOME)
        ========================================================================== */
    if (marqueeContainer) {
        marqueeContainer.addEventListener('mouseenter', () => {
            marqueeContainer.style.transition = "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            marqueeContainer.style.transform = "rotate(-2deg) translateY(-15px) scale(1.03)";
        });
        marqueeContainer.addEventListener('mouseleave', () => {
            marqueeContainer.style.transform = "rotate(-1deg) translateY(0) scale(1)";
        });
        marqueeContainer.addEventListener('mousemove', (e) => {
            const {
                offsetX,
                target
            } = e;
            const width = target.clientWidth;
            const tilt = ((offsetX / width) - 0.5) * 4;
            marqueeContainer.style.transform = `rotate(${tilt - 1}deg) translateY(-15px) scale(1.03)`;
        });
    }

    /*  ==========================================================================
        4. TARJETAS ARRASTRABLES / DRAG AND DROP (HOME)
        ========================================================================== */
    const sortableCards = document.getElementById('sortable-cards');
    if (sortableCards && typeof Sortable !== 'undefined') {
        new Sortable(sortableCards, {
            animation: 300,
            ghostClass: 'sortable-ghost',
            dragClass: 'sortable-drag',
            delay: 100,
            delayOnTouchOnly: true,
            onStart: function () {
                document.body.classList.add('is-dragging');
            },
            onEnd: function () {
                setTimeout(() => document.body.classList.remove('is-dragging'), 100);
            }
        });

        // Evitar clic accidental al arrastrar
        const projectLinks = document.querySelectorAll('.project-card');
        projectLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                if (document.body.classList.contains('is-dragging')) {
                    e.preventDefault();
                }
            });
        });
    }

    /*  ==========================================================================
        5. INSIDE YOYI'S MIND - ELEMENTOS FLOTANTES (HOME)
        ========================================================================== */
    const mindItems = [{
            name: 'Marshall Headphones',
            img: '../assets/branding/auriculares-item.webp',
            x: -380,
            y: -180
        },
        {
            name: 'Colorful maxi dresses',
            img: '../assets/branding/vestidoamarillo-item.webp',
            x: 450,
            y: -180
        },
        {
            name: 'Tropical Fruits',
            img: '../assets/branding/frutas-item.webp',
            x: -450,
            y: 100
        },
        {
            name: 'Creating Spotify Playlists',
            img: '../assets/branding/laptop-item.webp',
            x: 400,
            y: 120,
            large: true
        },
        {
            name: 'Rollerskating',
            img: '../assets/branding/rioroller-item.webp',
            x: -180,
            y: -380
        },
        {
            name: 'Nike Dunk Low Enthusiast',
            img: '../assets/branding/shoe1-item.webp',
            x: 200,
            y: -380
        },
    ];

    const headTrigger = document.getElementById('yoyi-head-trigger');
    const floatingContainer = document.getElementById('floating-items');
    let mindIsOpen = false;

    if (headTrigger && floatingContainer) {
        const clickLabel = document.createElement('div');
        clickLabel.className = 'click-me-label';
        clickLabel.textContent = 'CLICK ME';
        headTrigger.appendChild(clickLabel);

        headTrigger.addEventListener('click', () => {
            mindIsOpen = !mindIsOpen;
            headTrigger.classList.toggle('is-open', mindIsOpen);
            clickLabel.style.opacity = mindIsOpen ? '0' : '1';
            clickLabel.style.pointerEvents = mindIsOpen ? 'none' : 'auto';

            if (mindIsOpen) {
                renderMindItems();
            } else {
                const items = document.querySelectorAll('.mind-item');
                items.forEach(item => {
                    item.style.transform = 'translate(-50%, -50%) scale(0)';
                    item.style.opacity = '0';
                    setTimeout(() => item.remove(), 800);
                });
            }
        });

        function renderMindItems() {
            floatingContainer.innerHTML = '';
            mindItems.forEach((item, index) => {
                const div = document.createElement('div');
                div.className = 'mind-item';
                const targetX = `calc(-50% + ${item.x}px)`;
                const targetY = `calc(-50% + ${item.y}px)`;
                div.style.setProperty('--target-x', targetX);
                div.style.setProperty('--target-y', targetY);

                div.innerHTML = `
            <img src="${item.img}" alt="${item.name}" ${item.large ? 'class="img-large"' : ''}>
            <div class="item-title">${item.name}</div>
        `;
                floatingContainer.appendChild(div);

                setTimeout(() => {
                    div.style.transform = `translate(${targetX}, ${targetY}) scale(1)`;
                    div.style.opacity = '1';
                    setTimeout(() => div.classList.add('active'), 800);
                }, index * 120);
            });
        }
    }

    /*  ==========================================================================
        6. AUDIOVISUAL - REPRODUCTOR CON CLICK (AUDIOVISUAL)
        ========================================================================== */
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    if (videoWrappers.length > 0) {
        videoWrappers.forEach(wrapper => {
            const video = wrapper.querySelector('video');
            const overlay = wrapper.querySelector('.play-overlay');

            if (video && overlay) {
                wrapper.addEventListener('click', () => {
                    if (video.paused) {
                        video.play();
                        overlay.style.opacity = '0';
                        overlay.style.pointerEvents = 'none';
                    } else {
                        video.pause();
                        overlay.style.opacity = '1';
                    }
                });
            }
        });
    }

    /*  ==========================================================================
        7. BRANDING - NAVEGACIÓN ENTRE GRILLA Y DETALLES (BRANDING)
        ========================================================================== */
    const gridView = document.getElementById('projects-grid');
    const detailsContainer = document.getElementById('project-details-container');
    const closeBtn = document.getElementById('btn-close-project');
    const cardItems = document.querySelectorAll('.project-card-item');
    const detailContents = document.querySelectorAll('.project-detail-content');

    if (gridView && detailsContainer && closeBtn && cardItems.length > 0) {
        cardItems.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-project');
                gridView.classList.add('hidden');
                detailsContainer.classList.remove('hidden');

                detailContents.forEach(content => content.classList.add('hidden'));
                const activeContent = document.getElementById(projectId);
                if (activeContent) activeContent.classList.remove('hidden');

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });

        closeBtn.addEventListener('click', () => {
            detailsContainer.classList.add('hidden');
            gridView.classList.remove('hidden');
        });
    }

    /*  ==========================================================================
        8. ART - MODAL/OVERLAY DE IMÁGENES Y VIDEOS (ART)
        ========================================================================== */
    const artCards = document.querySelectorAll('.art-card');
    const artOverlay = document.getElementById('art-overlay');
    const overlayImg = document.getElementById('overlay-img');
    const overlayVideo = document.getElementById('overlay-video');
    const overlayTitle = document.getElementById('overlay-title');

    if (artCards.length > 0 && artOverlay) {
        artCards.forEach(card => {
            card.addEventListener('click', () => {
                const mediaElement = card.querySelector('img, video');
                const title = card.getAttribute('data-title');

                if (overlayTitle) overlayTitle.textContent = title;

                // 1. Ocultar ambos elementos por defecto por seguridad
                if (overlayImg) overlayImg.classList.add('hidden');
                if (overlayVideo) {
                    overlayVideo.classList.add('hidden');
                    overlayVideo.pause();
                }

                // 2. Mostrar solo el que corresponde
                if (mediaElement) {
                    if (mediaElement.tagName === 'VIDEO') {
                        if (overlayVideo) {
                            overlayVideo.src = mediaElement.src;
                            overlayVideo.classList.remove('hidden');
                            overlayVideo.play();
                        }
                    } else {
                        if (overlayImg) {
                            overlayImg.src = mediaElement.src;
                            overlayImg.classList.remove('hidden');
                        }
                    }
                }

                // 3. Abrir la pantalla oscura
                artOverlay.classList.remove('opacity-0', 'pointer-events-none');
                artOverlay.classList.add('opacity-100', 'pointer-events-auto');
            });
        });

        // 4. Lógica para cerrar la pantalla oscura
        artOverlay.addEventListener('click', () => {
            artOverlay.classList.remove('opacity-100', 'pointer-events-auto');
            artOverlay.classList.add('opacity-0', 'pointer-events-none');
            if (overlayVideo) overlayVideo.pause();
        });
    }

    /*  ==========================================================================
        9. P5.JS - EYEBALL BUDDY (EL OJITO DEL FOOTER)
        ========================================================================== */
    if (document.getElementById('eyeball-buddy-container') && typeof p5 !== 'undefined') {
        new p5(function (p) {
            const EYE_SIZE = 38;
            const PUPIL_SIZE = 18;
            const PUPIL_OFFSET = 9;
            const EYE_GAP = 54;
            const BODY_W = 130;
            const BODY_H = 80;
            const PEEK_AMOUNT = 58;

            let canvasEl;
            let mouseGlobalX = 0;
            let mouseGlobalY = 0;

            document.addEventListener('mousemove', function (e) {
                mouseGlobalX = e.clientX;
                mouseGlobalY = e.clientY;
            });

            p.setup = function () {
                let cnv = p.createCanvas(BODY_W + 40, PEEK_AMOUNT + 20);
                canvasEl = cnv.elt;
                cnv.parent('eyeball-buddy-container');
                p.angleMode(p.DEGREES);
                p.noStroke();
            };

            p.draw = function () {
                p.clear();
                const rect = canvasEl.getBoundingClientRect();
                const localMX = mouseGlobalX - rect.left;
                const localMY = mouseGlobalY - rect.top;
                const cx = p.width / 2;

                p.fill('#1C1C1C');
                p.rect(cx - BODY_W / 2, 10, BODY_W, BODY_H + 20, 30, 30, 0, 0);

                p.noFill();
                p.stroke('#F6C445');
                p.strokeWeight(3);
                p.rect(cx - BODY_W / 2, 10, BODY_W, BODY_H + 20, 30, 30, 0, 0);
                p.noStroke();

                const eyeY = 34;
                const leftX = cx - EYE_GAP / 2;
                const rightX = cx + EYE_GAP / 2;

                drawEye(p, leftX, eyeY, localMX, localMY);
                drawEye(p, rightX, eyeY, localMX, localMY);
            };

            function drawEye(p, ex, ey, mx, my) {
                p.fill(255);
                p.ellipse(ex, ey, EYE_SIZE, EYE_SIZE);

                const angle = p.atan2(my - ey, mx - ex);
                p.push();
                p.translate(ex, ey);
                p.rotate(angle);
                p.fill(30);
                p.ellipse(PUPIL_OFFSET, 0, PUPIL_SIZE, PUPIL_SIZE);

                p.fill(255);
                p.ellipse(PUPIL_OFFSET + 3, -3, 5, 5);
                p.pop();
            }
        });
    }

    /*  ==========================================================================
        10. NUEVO: LIGHTBOX GENÉRICO (Para Storyboards y otros detalles)
        ========================================================================== */
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const avOverlay = document.getElementById('audiovisual-overlay');
    const avOverlayImg = document.getElementById('av-overlay-img');

    if (lightboxTriggers.length > 0 && avOverlay && avOverlayImg) {
        lightboxTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const img = trigger.querySelector('img');
                if (img) {
                    avOverlayImg.src = img.src;
                    avOverlay.classList.remove('opacity-0', 'pointer-events-none');
                    avOverlay.classList.add('opacity-100', 'pointer-events-auto');
                }
            });
        });

        avOverlay.addEventListener('click', () => {
            avOverlay.classList.remove('opacity-100', 'pointer-events-auto');
            avOverlay.classList.add('opacity-0', 'pointer-events-none');
        });
    }

});

/*  ==========================================================================
    11. LOAD MORE ART (LÓGICA PARA MÓVILES/TABLETS)
    ========================================================================== */
const artItems = document.querySelectorAll('.art-card');
const loadMoreBtn = document.getElementById('loadMoreArtBtn');
let currentItemsToShow = 4; // Empezamos mostrando 4

if (loadMoreBtn && artItems.length > 0) {
    const updateArtVisibility = () => {
        // Si estamos en pantallas menores a 1024px (Móvil y Tablet)
        if (window.innerWidth < 1024) {
            artItems.forEach((item, index) => {
                if (index >= currentItemsToShow) {
                    item.style.display = 'none';
                } else {
                    item.style.display = 'flex';
                }
            });

            // Ocultar el botón si ya mostramos todas las ilustraciones
            if (currentItemsToShow >= artItems.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }
        } else {
            // En Desktop (1024px o más) mostramos siempre todo sin botón
            artItems.forEach(item => item.style.display = 'flex');
            loadMoreBtn.style.display = 'none';
        }
    };

    // Ejecutamos al cargar la página y al cambiar el tamaño de la ventana
    updateArtVisibility();
    window.addEventListener('resize', updateArtVisibility);

    // Al hacer clic en "Load More", sumamos 4 ilustraciones más
    loadMoreBtn.addEventListener('click', () => {
        currentItemsToShow += 4;
        updateArtVisibility();
    });
}

/*  ==========================================================================
    12. LOAD MORE BRANDING (LÓGICA PARA MÓVILES/TABLETS)
    ========================================================================== */
const brandingItems = document.querySelectorAll('.project-card-item');
const loadMoreBrandingBtn = document.getElementById('loadMoreBrandingBtn');
let currentBrandingToShow = 4;

if (loadMoreBrandingBtn && brandingItems.length > 0) {
    const updateBrandingVisibility = () => {
        if (window.innerWidth < 1024) {
            brandingItems.forEach((item, index) => {
                if (index >= currentBrandingToShow) {
                    item.style.display = 'none';
                } else {
                    item.style.display = 'flex';
                }
            });

            if (currentBrandingToShow >= brandingItems.length) {
                loadMoreBrandingBtn.style.display = 'none';
            } else {
                loadMoreBrandingBtn.style.display = 'block';
            }
        } else {
            brandingItems.forEach(item => item.style.display = 'flex');
            loadMoreBrandingBtn.style.display = 'none';
        }
    };

    updateBrandingVisibility();
    window.addEventListener('resize', updateBrandingVisibility);

    loadMoreBrandingBtn.addEventListener('click', () => {
        currentBrandingToShow += 4;
        updateBrandingVisibility();
    });
}

/*  ==========================================================================
    13. CAMBIO DE IDIOMA GENÉRICO (LANGUAGE SWITCHER)
    ========================================================================== */
    // Esta función toma el idioma deseado ('en' o 'es') y cambia la URL actual
    window.switchLanguage = function(newLang) {
        // Obtenemos la ruta actual (Ej: /en/uxui.html o /es/art.html)
        // --- REGLA TEMPORAL PARA ESPAÑOL ---
        // Mientras la web en español esté en construcción, forzamos la redirección al index
        if (newLang === 'es') {
            window.location.href = '/es/index.html';
            return; // Detenemos la función aquí
        }
        // -----------------------------------

        // Comportamiento normal (ej. cuando cambian de ES a EN)
        if (currentPath.includes('/en/') || currentPath.includes('/es/')) {
            const newPath = currentPath.replace(/\/(en|es)\//, `/${newLang}/`);
            window.location.href = newPath;
        } else {
            window.location.href = `/${newLang}/index.html`;
        }
    };