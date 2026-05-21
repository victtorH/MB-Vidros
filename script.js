document.addEventListener("DOMContentLoaded", function () {
    
    // =========================================================
    // 1. INICIALIZAÇÃO DO LENIS (SMOOTH SCROLLING)
    // =========================================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing premium
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);


const secoes = document.querySelectorAll("main section[id]");
    const itensMenu = document.querySelectorAll(".header-nav__menu .header-nav__item");

    // 2. Configuração do "sensor" de região da tela (Margem de detecção)
    const opcoesObservador = {
        root: null,
        // Detecta a seção quando ela ocupa a área central da tela (evita quebras no meio do scroll)
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0
    };

    // 3. Lógica que gerencia as classes ativas
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            // Se a seção entrou na área de foco configurada
            if (entrada.isIntersecting) {
                const idSecaoAtiva = entrada.target.getAttribute("id");
                
                // Percorre os itens do menu para ligar/desligar a classe active
                itensMenu.forEach(item => {
                    const link = item.querySelector("a");
                    
                    if (link && link.getAttribute("href") === `#${idSecaoAtiva}`) {
                        item.classList.add("header-nav__item--active");
                    } else {
                        item.classList.remove("header-nav__item--active");
                    }
                });
            }
        });
    }, opcoesObservador);

    // 4. Ativa o observador em cada uma das seções da página
    secoes.forEach(secao => {
        observador.observe(secao);
    });


    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Impede o pulo seco do navegador
            
            const targetId = this.getAttribute('href');

            if (targetId === '#' || !targetId) return;

            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // O Lenis calcula a posição exata e rola com a mesma suavidade do mouse
                lenis.scrollTo(targetElement, {
                    offset: -80 // Desconto da altura do seu Header fixo para não cobrir o título!
                });
            }
        });
    });

    // =========================================================
    // 2. CONFIGURAÇÃO DO GSAP & SCROLLTRIGGER
    // =========================================================
    gsap.registerPlugin(ScrollTrigger);

    // Prepara elementos escondendo-os via JS para não piscarem antes da animação
    gsap.set('.hero__title, .hero__description, .hero__form-box', { y: 50, opacity: 0 });
    gsap.set('.expertise-item, .service-card, .process-step, .project-card, .testimonial-card', { y: 50, opacity: 0 });
    gsap.set('.contact__form-block', { scale: 0.9, opacity: 0 });

    // =========================================================
    // 3. ANIMAÇÃO DE ENTRADA (HERO SECTION)
    // =========================================================
    const heroTl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });
    
    heroTl.to('.header-nav', { y: 0, opacity: 1, duration: 1 })
          .to('.hero__title', { y: 0, opacity: 1 }, "-=0.8")
          .to('.hero__description', { y: 0, opacity: 1 }, "-=1")
          .to('.hero__form-box', { y: 0, opacity: 1 }, "-=1");

    // =========================================================
    // 4. ANIMAÇÕES AO ROLAR A PÁGINA (SCROLLTRIGGERS)
    // =========================================================

    // Expertise (Cascata)
    gsap.to('.expertise-item', {
        scrollTrigger: {
            trigger: '.expertise__grid',
            start: "top 80%", // Dispara quando o topo da grid bater em 80% da tela
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1, // Um após o outro
        ease: "power3.out"
    });

    // Serviços (Cascata com rotação leve)
    gsap.to('.service-card', {
        scrollTrigger: {
            trigger: '.services__grid',
            start: "top 75%",
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)", // Um pequeno efeito elástico
        clearProps: "transform"
    });

    // Processos (Steps da linha do tempo)
    gsap.to('.process-step', {
        scrollTrigger: {
            trigger: '.process__grid',
            start: "top 80%",
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });

    // =========================================================
    // 5. EFEITO PARALLAX NAS IMAGENS DOS PROJETOS (O Pulo do Gato)
    // =========================================================
    // Aplicamos um scale inicial na imagem para ela ter espaço para "se mover" dentro do card
    gsap.utils.toArray('.project-card__img').forEach(img => {
        gsap.to(img, {
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true // Faz a animação acompanhar a rolagem milímetro a milímetro
            },
            y: "0%", // Move a imagem para baixo enquanto rola
            ease: "none"
        });
    });

    // Aparecimento dos Cards de Projeto
    gsap.to('.project-card', {
        scrollTrigger: {
            trigger: '.projects__grid',
            start: "top 85%",
        },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out"
    });

    // Testemunhos
    gsap.to('.testimonial-card', {
        scrollTrigger: {
            trigger: '.testimonials__wrapper',
            start: "top 80%",
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
    });

    // Formulário de Contato (Escala e Fade)
    gsap.to('.contact__form-block', {
        scrollTrigger: {
            trigger: '.contact__wrapper',
            start: "top 75%",
        },
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "expo.out"
    });


// =========================================================
    // ENVIO DO FORMULÁRIO VIA AJAX (PRODUÇÃO EM HTTPS)
    // =========================================================
    const contactForm = document.querySelector('.contact__form');
    const submitBtn = contactForm.querySelector('.contact__submit');
    const modal = document.getElementById('thanksModal');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Segura a página no lugar (Heurística de Controle do Usuário)

            // Visibilidade do Status: Desabilita o botão e dá feedback visual
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Enviando...</span>';
            submitBtn.disabled = true;

            // Formata a rota oficial de AJAX do FormSubmit
            const ajaxUrl = contactForm.action.replace("formsubmit.co/", "formsubmit.co/ajax/");

            // Mapeia os inputs do HTML para um JSON limpo
            const objectData = {};
            const formData = new FormData(contactForm);
            formData.forEach((value, key) => {
                objectData[key] = value;
            });

            // Dispara a requisição em background (HTTPS -> HTTPS)
            fetch(ajaxUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(objectData)
            })
            .then(response => {
                if (response.ok) {
                    // Limpa os campos do formulário para o usuário
                    contactForm.reset();
                    
                    // Abre o modal de agradecimento premium com GSAP
                    openThanksModal();
                } else {
                    // Tratamento caso o servidor do FormSubmit passe por alguma instabilidade temporária
                    alert("Não foi possível enviar sua mensagem no momento. Por favor, tente novamente mais tarde.");
                }
            })
            .catch(error => {
                // Em produção, isso só acontecerá se a internet do usuário cair durante o clique
                console.error("Erro crítico de rede:", error);
                alert("Erro de conexão. Verifique sua internet e tente novamente.");
            })
            .finally(() => {
                // Restaura o botão para o estado original de clique
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

 // =========================================================
    // GERENCIAMENTO ANIMADO DO MODAL (VERSÃO CORRIGIDA)
    // =========================================================
    function openThanksModal() {
        const modalContent = modal.querySelector('.thanks-modal__content');
        const closeBtn = modal.querySelector('.thanks-modal__close-btn');
        const backdrop = modal.querySelector('.thanks-modal__backdrop');

        // 1. Reseta os estados visuais dos filhos antes de animar
        gsap.set(backdrop, { opacity: 0 });
        gsap.set(modalContent, { scale: 0.8, opacity: 0 });
        
        // 2. CORREÇÃO: Força a opacidade em "1" no container pai junto com a visibilidade
        gsap.set(modal, { visibility: 'visible', pointerEvents: 'auto', opacity: 1 });

        // Timeline de Entrada (Efeito pop elástico fluido)
        const modalTl = gsap.timeline();
        modalTl.to(backdrop, { opacity: 1, duration: 0.4 })
               .to(modalContent, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }, "-=0.2");

        // Função interna para fechar o modal com animação de saída
        const closeModal = () => {
            gsap.timeline({
                onComplete: () => {
                    // Retorna o container pai para o estado invisível padrão do CSS
                    gsap.set(modal, { visibility: 'hidden', pointerEvents: 'none', opacity: 0 });
                }
            })
            .to(modalContent, { scale: 0.9, opacity: 0, duration: 0.3, ease: "power2.in" })
            .to(backdrop, { opacity: 0, duration: 0.3 }, "-=0.2");

            // Remove os listeners após o fechamento para otimizar performance
            closeBtn.removeEventListener('click', closeModal);
            backdrop.removeEventListener('click', closeModal);
        };

        // Vincula os gatilhos de fechamento
        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);
    }

    // =========================================================
    // AÇÃO DE CONTATO RÁPIDO DO HERO (WHATSAPP VIA LINK)
    // =========================================================
    const heroSubmitBtn = document.querySelector('.hero__form-box .hero__submit');
    const heroInput = document.querySelector('.hero__form-box .hero__input');

    if (heroSubmitBtn && heroInput) {
        heroSubmitBtn.addEventListener('click', function (e) {
            e.preventDefault(); // Impede o link vazio de atualizar a página

            const nomeCompleto = heroInput.value.trim();

            // Heurística 5 (Prevenção de Erros): Se o usuário não digitou nada, foca no input
            if (!nomeCompleto) {
                heroInput.focus();
                heroInput.style.borderColor = "var(--color-outline-variant)"; // Feedback visual sutil
                return;
            }

            // Extrai apenas o primeiro nome para uma saudação mais calorosa e informal
            const primeiroNome = nomeCompleto.split(/\s+/)[0];

            // Mensagem curta, amigável e direta
            const textoMensagem = `Olá! Me chamo ${primeiroNome} e vi o site da MB Vidros. Gostaria de entender mais de como funcionam!`;

            // Configuração do seu número (Mantendo o padrão dos seus códigos anteriores)
            const numeroDestino = "5511972108611"; 
            const textoCodificado = encodeURIComponent(textoMensagem);
            const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroDestino}&text=${textoCodificado}`;

            // Abre o WhatsApp em uma nova aba sem perder o usuário do seu site
            window.open(urlWhatsApp, '_blank');
        });
        
        // Permite que o usuário também aperte "Enter" dentro do input para disparar o clique
        heroInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                heroSubmitBtn.click();
            }
        });
    }
    
});