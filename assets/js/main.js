// ============================================
// MAIN.JS - Funcionalidades Principais
// ============================================

// Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// SMOOTH SCROLL PARA ÂNCORAS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================
// ANIMAÇÃO AO ENTRAR NA VIEWPORT
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar cards
document.querySelectorAll('.infografico-card, .testimonial-card, .podcast-card, .galeria-item, .inovacao-card, .credito-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// ============================================
// CONTADORES ANIMADOS
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('.metric-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString('pt-BR');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString('pt-BR');
            }
        };

        // Iniciar animação quando a seção ficar visível
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && current === 0) {
                updateCounter();
                observer.unobserve(counter);
            }
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

// Chamar função de contadores
animateCounters();

// ============================================
// FORM DE CONTATO
// ============================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const age = document.getElementById('age').value;
        const message = document.getElementById('message').value;
        
        // Simular envio
        const formFeedback = document.getElementById('form-feedback');
        formFeedback.innerHTML = `
            <div style="background: #4caf50; color: white; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <strong>✓ Mensagem enviada com sucesso!</strong><br>
                Obrigado, ${name}! Entraremos em contato em breve no email ${email}.
            </div>
        `;
        formFeedback.classList.remove('hidden');
        
        // Limpar formulário
        contactForm.reset();
        
        // Esconder mensagem após 5 segundos
        setTimeout(() => {
            formFeedback.classList.add('hidden');
        }, 5000);
    });
}

// ============================================
// PODCAST PLAYER
// ============================================
document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('🎙️ Podcast Player\n\nEm um site real, aqui você teria acesso a um reprodutor de áudio com os podcasts implementados.\n\nPor enquanto, este é um protótipo interativo!');
    });
});

// ============================================
// SCROLL PARALLAX
// ============================================
window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    parallaxElements.forEach(element => {
        const scrollPosition = window.scrollY;
        const elementOffset = element.offsetTop;
        const offset = (scrollPosition - elementOffset) * 0.5;
        element.style.transform = `translateY(${offset}px)`;
    });
});

// ============================================
// HIDDEN FEATURE: Konami Code (↑ ↑ ↓ ↓ ← → ← → B A)
// ============================================
const konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiPattern.length - 1);

    if (konamiCode.join(',').includes(konamiPattern.join(','))) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    document.body.style.filter = 'hue-rotate(45deg)';
    console.log('🎉 Easter Egg Ativado! Aperte F5 para voltar ao normal.');
    alert('🌿 Parabéns! Você encontrou o Easter Egg!\n\nAgroFortuna aprecia sua curiosidade! 🌱');
}

// ============================================
// EFEITO DE SCROLL SUAVE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Efeito de fade na navbar ao fazer scroll
    let lastScrollTop = 0;
    const navbar = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        let scrollTop = window.scrollY;

        if (scrollTop > 100) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        }

        lastScrollTop = scrollTop;
    });
});

// ============================================
// NOTIFICAÇÃO DE SUPORTE A BROWSER
// ============================================
if (!('IntersectionObserver' in window)) {
    console.warn('Seu navegador não suporta IntersectionObserver. Algumas animações podem não funcionar corretamente.');
}

// ============================================
// LOG DE CARREGAMENTO
// ============================================
console.log('%cAgroFortuna - Cultivando o Futuro', 'font-size: 20px; color: #7cb342; font-weight: bold;');
console.log('%cSite desenvolvido com ❤️ por Alexandre Henrique Lopes', 'font-size: 12px; color: #2d5016;');
console.log('%cPsicologia em Desenvolvimento', 'font-size: 11px; color: #666;');
