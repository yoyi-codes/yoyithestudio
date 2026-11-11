document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.work-carousel');
    if (carousel) {
        const track = carousel.querySelector('.work-track');
        const controls = carousel.querySelector('.work-controls');
        const pause = controls.querySelector('[data-pause]');
        const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
        const slides = Array.from(track.children);
        const players = slides.map(slide => slide.querySelector('iframe, video'));
        const dots = document.createElement('div');
        dots.className = 'work-dots';
        const step = () => slides[1].offsetLeft - slides[0].offsetLeft;
        const current = () => Math.round(track.scrollLeft / step());
        const goTo = (index, smooth = true) => {
            track.scrollTo({ left: index * step(), behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant' });
        };
        slides.forEach((slide, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('aria-label', players[index]?.title || players[index]?.getAttribute('aria-label') || slide.textContent.trim());
            button.addEventListener('click', () => goTo(index));
            dots.append(button);
        });
        controls.prepend(dots);
        let inView = false;
        const syncPlayers = () => {
            const selected = current();
            players.forEach((player, index) => {
                dots.children[index].setAttribute('aria-current', String(index === selected));
                if (!player) return;
                const active = index === selected && inView && !document.hidden;
                const autoplay = active && !reducedMotion.matches && pause.getAttribute('aria-pressed') === 'false';
                if (player instanceof HTMLVideoElement) {
                    if (autoplay) {
                        player.muted = true;
                        player.play().catch(() => {});
                    } else {
                        player.pause();
                    }
                } else if (active && !player.hasAttribute('src')) {
                    player.src = player.dataset.src + (autoplay ? '?autoplay=1&muted=1&loop=1' : '');
                } else if (!active) {
                    player.removeAttribute('src');
                }
            });
        };
        const move = direction => {
            const index = current();
            const next = (index + direction + slides.length) % slides.length;
            goTo(next, Math.abs(next - index) === 1);
        };
        controls.hidden = false;
        controls.addEventListener('click', event => {
            const button = event.target.closest('button[data-direction]');
            if (button) move(Number(button.dataset.direction));
        });
        pause.addEventListener('click', () => {
            const paused = pause.getAttribute('aria-pressed') === 'false';
            pause.setAttribute('aria-pressed', String(paused));
            const player = players[current()];
            if (player instanceof HTMLIFrameElement) player.removeAttribute('src');
            syncPlayers();
        });
        let scrollTimer;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(syncPlayers, 120);
        }, { passive: true });
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(([entry]) => {
                inView = entry.intersectionRatio >= 0.5;
                syncPlayers();
            }, { threshold: 0.5 }).observe(track);
        } else {
            inView = true;
        }
        document.addEventListener('visibilitychange', syncPlayers);
        reducedMotion.addEventListener('change', () => {
            const player = players[current()];
            if (player instanceof HTMLIFrameElement) player.removeAttribute('src');
            syncPlayers();
        });
        syncPlayers();
        window.setInterval(() => {
            if (inView && !document.hidden && !reducedMotion.matches && pause.getAttribute('aria-pressed') === 'false'
                && !carousel.matches(':hover, :focus-within')) {
                move(1);
            }
        }, 8500);
    }

    /* ==========================================================================
        1. VARIABLES GLOBALES Y NAVEGACIÓN MÓVIL
        ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const logo = document.querySelector('.logo-pop');
    const marqueeContainer = document.querySelector('.marquee-container');

    const mobileViewProjectsBtn = document.getElementById('mobileViewProjectsBtn');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => mobileMenu.classList.add('active'));
    }

    if (mobileViewProjectsBtn && mobileMenu) {
        mobileViewProjectsBtn.addEventListener('click', () => mobileMenu.classList.add('active'));
    }

    if (closeMobileMenu && mobileMenu) {
        closeMobileMenu.addEventListener('click', () => mobileMenu.classList.remove('active'));
    }
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('active'));
    });

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

    /* ==========================================================================
        2. REVEAL AL HACER SCROLL
        ========================================================================== */
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    if (reveals.length && 'IntersectionObserver' in window) {
        const desktopMotion = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(({ target, isIntersecting }) => {
                if (!isIntersecting) return;
                target.classList.add('is-visible');
                observer.unobserve(target);
            });
        }, { rootMargin: '0px 0px -60px 0px', threshold: 0.15 });

        const syncReveals = () => {
            observer.disconnect();
            reveals.forEach(element => {
                element.classList.toggle('reveal-pending', desktopMotion.matches);
                if (desktopMotion.matches && !element.classList.contains('is-visible')) observer.observe(element);
            });
        };

        desktopMotion.addEventListener('change', syncReveals);
        syncReveals();
    }

    document.querySelectorAll('.bio-poster').forEach(poster => {
        poster.addEventListener('click', () => {
            poster.focus({ preventScroll: true });
            poster.getAnimations({ subtree: true }).forEach(animation => {
                animation.currentTime = 0;
                animation.play();
            });
        });
    });

    /* ==========================================================================
        3. MARQUEE INTERACTIVO
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

    /* ==========================================================================
        4. TARJETAS ARRASTRABLES / DRAG AND DROP
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

        const projectLinks = document.querySelectorAll('.project-card');
        projectLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                if (document.body.classList.contains('is-dragging')) {
                    e.preventDefault();
                }
            });
        });
    }

    /* ==========================================================================
       5. INSIDE YOYI'S MIND 
       ========================================================================== */
    const currentLang = document.documentElement.lang;

    const mindItems = [{
            name: currentLang === 'es' ? 'Auriculares Marshall' : 'Marshall Headphones',
            img: '../assets/branding/auriculares-item.webp',
            x: -380,
            y: -180
        },
        {
            name: currentLang === 'es' ? 'Vestidos largos y coloridos' : 'Colorful maxi dresses',
            img: '../assets/branding/vestidoamarillo-item.webp',
            x: 450,
            y: -180
        },
        {
            name: currentLang === 'es' ? 'Frutas Tropicales' : 'Tropical Fruits',
            img: '../assets/branding/frutas-item.webp',
            x: -450,
            y: 100
        },
        {
            name: currentLang === 'es' ? 'Armar Playlists en Spotify' : 'Creating Spotify Playlists',
            img: '../assets/branding/laptop-item.webp',
            x: 400,
            y: 120,
            large: true
        },
        {
            name: currentLang === 'es' ? 'Andar en rollers' : 'Rollerskating',
            img: '../assets/branding/rioroller-item.webp',
            x: -180,
            y: -380
        },
        {
            name: currentLang === 'es' ? 'Acumular nike dunks' : 'Nike Dunk Low Enthusiast',
            img: '../assets/branding/shoe1-item.webp',
            x: 200,
            y: -380
        }
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

    /* ==========================================================================
        6. AUDIOVISUAL - REPRODUCTOR CON CLICK
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

    /* ==========================================================================
        7. BRANDING - NAVEGACIÓN
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

    /* ==========================================================================
        8. ART - MODAL
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

                if (overlayImg) overlayImg.classList.add('hidden');
                if (overlayVideo) {
                    overlayVideo.classList.add('hidden');
                    overlayVideo.pause();
                }

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

                artOverlay.classList.remove('opacity-0', 'pointer-events-none');
                artOverlay.classList.add('opacity-100', 'pointer-events-auto');
            });
        });

        artOverlay.addEventListener('click', () => {
            artOverlay.classList.remove('opacity-100', 'pointer-events-auto');
            artOverlay.classList.add('opacity-0', 'pointer-events-none');
            if (overlayVideo) overlayVideo.pause();
        });
    }

    /* ==========================================================================
        9. P5.JS - EYEBALL BUDDY
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

    /* ==========================================================================
        10. P5.JS - FONDO 3D BLURRY PARA EL HERO (INDEX)
        ========================================================================== */
    if (document.getElementById('p5-bg-container') && typeof p5 !== 'undefined') {
        new p5(function (p) {
            let shapes = [];
            const palette = ['#F4939D', '#F6C445', '#538F50', '#7DC3D1'];

            p.setup = function () {
                let cnv = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
                cnv.parent('p5-bg-container');
                p.noStroke();

                for (let i = 0; i < 6; i++) {
                    shapes.push({
                        type: p.random(['sphere', 'box', 'torus', 'cone']),
                        x: p.random(-p.width / 2, p.width / 2),
                        y: p.random(-p.height / 2, p.height / 2),
                        z: p.random(-200, 100),
                        rx: p.random(p.TWO_PI),
                        ry: p.random(p.TWO_PI),
                        speedX: p.random(-0.5, 0.5),
                        speedY: p.random(-0.5, 0.5),
                        rotSpeedX: p.random(-0.01, 0.01),
                        rotSpeedY: p.random(-0.01, 0.01),
                        color: p.color(p.random(palette))
                    });
                }
            };

            p.draw = function () {
                p.clear();

                p.ambientLight(150);
                p.directionalLight(255, 255, 255, 0.5, 0.5, -1);

                for (let s of shapes) {
                    p.push();
                    p.translate(s.x, s.y, s.z);
                    p.rotateX(s.rx);
                    p.rotateY(s.ry);

                    p.ambientMaterial(s.color);

                    if (s.type === 'sphere') p.sphere(120);
                    else if (s.type === 'box') p.box(160);
                    else if (s.type === 'torus') p.torus(100, 40);
                    else if (s.type === 'cone') p.cone(100, 150);

                    p.pop();

                    s.x += s.speedX;
                    s.y += s.speedY;
                    s.rx += s.rotSpeedX;
                    s.ry += s.rotSpeedY;

                    if (s.x < -p.width / 1.5 || s.x > p.width / 1.5) s.speedX *= -1;
                    if (s.y < -p.height / 1.5 || s.y > p.height / 1.5) s.speedY *= -1;
                }
            };

            p.windowResized = function () {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        });
    }

    /* ==========================================================================
        11. NUEVO: LIGHTBOX GENÉRICO 
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

/* ==========================================================================
    12. LOAD MORE ART
    ========================================================================== */
const artItems = document.querySelectorAll('.art-card');
const loadMoreBtn = document.getElementById('loadMoreArtBtn');
let currentItemsToShow = 4;

if (loadMoreBtn && artItems.length > 0) {
    const updateArtVisibility = () => {
        if (window.innerWidth < 1024) {
            artItems.forEach((item, index) => {
                if (index >= currentItemsToShow) {
                    item.style.display = 'none';
                } else {
                    item.style.display = 'flex';
                }
            });

            if (currentItemsToShow >= artItems.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
            }
        } else {
            artItems.forEach(item => item.style.display = 'flex');
            loadMoreBtn.style.display = 'none';
        }
    };

    updateArtVisibility();
    window.addEventListener('resize', updateArtVisibility);

    loadMoreBtn.addEventListener('click', () => {
        currentItemsToShow += 4;
        updateArtVisibility();
    });
}

/* ==========================================================================
    13. LOAD MORE BRANDING
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

/* ==========================================================================
    14. CAMBIO DE IDIOMA GENÉRICO (LANGUAGE SWITCHER)
    ========================================================================== */
window.switchLanguage = function (newLang) {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/en/') || currentPath.includes('/es/')) {
        const newPath = currentPath.replace(/\/(en|es)\//, `/${newLang}/`);
        window.location.href = newPath;
    } else {
        window.location.href = `/${newLang}/`;
    }
};
