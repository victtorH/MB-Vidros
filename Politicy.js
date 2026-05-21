 document.addEventListener('DOMContentLoaded', () => {
            
                const dateSpan = document.getElementById('last-updated-date');
            if (dateSpan) {
                const today = new Date();
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                let formattedDate = today.toLocaleDateString('pt-BR', options);
                
                // Capitaliza a primeira letra do mês (ex: "de maio" -> "de Maio")
                formattedDate = formattedDate.replace(/de ([a-z])/g, (match, letter) => 'de ' + letter.toUpperCase());
                dateSpan.textContent = formattedDate;
            }
       
    
    // 1. INICIALIZAÇÃO LENIS (SMOOTH SCROLL)
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva física exponencial suave
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 1.5,
                infinite: false,
            });

            // Sincronização direta com o loop do GSAP ScrollTrigger
            lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);

            // 2. TIMELINE ENTRADA HERO (Awwwards Intro)
            const introTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
            
            introTimeline.from(".hero-title", {
                y: 80,
                opacity: 0,
                duration: 1.4,
                delay: 0.1
            })
            .from(".hero-subtitle", {
                y: 30,
                opacity: 0,
                duration: 1
            }, "-=1.0");

            // 3. BARRA DE PROGRESSO DE SCROLL (Heurística #1)
            gsap.to(".scroll-progress-bar", {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true
                }
            });

            // 4. TRANSFORMAÇÃO DINÂMICA DO HEADER NO SCROLL
            gsap.to(".app-header", {
                scrollTrigger: {
                    trigger: "body",
                    start: "top -50px",
                    toggleActions: "play none none reverse"
                },
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 10px 30px rgba(0, 15, 34, 0.04)",
                paddingTop: "12px",
                paddingBottom: "12px",
                duration: 0.3
            });

            // ==========================================================
            // 5. REVELAÇÃO DE SEÇÕES E COMPONENTES NO SCROLL (GSAP & ScrollTrigger)
            // ==========================================================
            
            // Entrada suave dos containers principais
            const cards = document.querySelectorAll('.card-container');
            cards.forEach(card => {
                gsap.fromTo(card, 
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // Entrada em cascata (Stagger) na malha de cartões de dados
            gsap.fromTo(".data-card", 
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".data-grid",
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Entrada do Callout Informativo
            gsap.fromTo(".protection-callout", 
                { x: -40, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".protection-callout",
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // ==========================================================
            // 6. ROLAGEM DINÂMICA DO SUMÁRIO LATERAL (ScrollTrigger TOC Sync)
            // ==========================================================
            const sections = document.querySelectorAll('article .content-section');
            const navLinks = document.querySelectorAll('.aside-toc .toc-link');

            sections.forEach(section => {
                const id = section.getAttribute('id');
                const matchingLink = document.querySelector(`.aside-toc .toc-link[href="#${id}"]`);
                
                if (matchingLink) {
                    ScrollTrigger.create({
                        trigger: section,
                        start: "top 160px",   // Sincroniza dinamicamente com a área útil
                        end: "bottom 160px",
                        onToggle: self => {
                            if (self.isActive) {
                                navLinks.forEach(link => link.classList.remove('active'));
                                matchingLink.classList.add('active');
                            }
                        }
                    });
                }
            });

            // Tratamento responsivo para cliques suaves no sumário
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        lenis.scrollTo(targetElement, {
                            offset: -110,
                            duration: 1.2,
                            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                        });
                    }
                });
            });
        });