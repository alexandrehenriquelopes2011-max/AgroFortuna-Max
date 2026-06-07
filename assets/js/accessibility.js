// ============================================
// ACCESSIBILITY.JS - Funções de Acessibilidade
// ============================================

class AccessibilityManager {
    constructor() {
        this.darkModeBtn = document.getElementById('darkModeBtn');
        this.accessibilityBtn = document.getElementById('accessibilityBtn');
        this.synth = window.speechSynthesis;
        this.isSpeaking = false;

        this.init();
    }

    init() {
        this.loadDarkMode();
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.darkModeBtn) {
            this.darkModeBtn.addEventListener('click', () => this.toggleDarkMode());
        }

        if (this.accessibilityBtn) {
            this.accessibilityBtn.addEventListener('click', () => this.toggleAccessibility());
        }

        // Fechar fala ao sair da página
        window.addEventListener('beforeunload', () => {
            this.synth.cancel();
        });
    }

    toggleDarkMode() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);

        // Feedback visual
        if (isDarkMode) {
            this.speak('Modo escuro ativado');
        } else {
            this.speak('Modo claro ativado');
        }
    }

    loadDarkMode() {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
    }

    toggleAccessibility() {
        if (this.isSpeaking) {
            this.synth.cancel();
            this.isSpeaking = false;
            this.accessibilityBtn.style.opacity = '1';
            console.log('Leitura interrompida');
            return;
        }

        this.readPageContent();
    }

    readPageContent() {
        this.isSpeaking = true;
        this.accessibilityBtn.style.opacity = '0.5';

        // Obter todo o conteúdo de texto relevante
        const contentElements = document.querySelectorAll(
            'h1, h2, h3, .hero-subtitle, .hero-description, .section-title, p, li'
        );

        let fullText = 'Iniciando leitura do site AgroFortuna. ';

        contentElements.forEach(element => {
            const text = element.textContent.trim();
            if (text && text.length > 0) {
                fullText += text + '. ';
            }
        });

        this.speak(fullText, () => {
            this.isSpeaking = false;
            this.accessibilityBtn.style.opacity = '1';
        });
    }

    speak(text, onEnd = null) {
        // Cancelar qualquer fala anterior
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = 1;

        if (onEnd) {
            utterance.onend = onEnd;
        }

        this.synth.speak(utterance);
    }
}

// Inicializar acessibilidade
document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityManager();
});

// ============================================
// KEYBOARD SHORTCUTS - Atalhos de Teclado
// ============================================

document.addEventListener('keydown', (e) => {
    // Alt + D = Dark Mode
    if (e.altKey && e.key === 'd') {
        document.getElementById('darkModeBtn')?.click();
    }

    // Alt + V = Voice Reader
    if (e.altKey && e.key === 'v') {
        document.getElementById('accessibilityBtn')?.click();
    }

    // Alt + H = Home
    if (e.altKey && e.key === 'h') {
        document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
    }

    // Alt + C = Contato
    if (e.altKey && e.key === 'c') {
        document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
    }
});

// ============================================
// FONT SIZE ADJUSTMENT
// ============================================

class FontSizeManager {
    constructor() {
        this.currentSize = 100;
        this.minSize = 80;
        this.maxSize = 150;
        this.step = 10;

        this.loadFontSize();
    }

    loadFontSize() {
        const savedSize = localStorage.getItem('fontSize');
        if (savedSize) {
            this.setFontSize(parseInt(savedSize));
        }
    }

    setFontSize(percentage) {
        this.currentSize = Math.max(this.minSize, Math.min(this.maxSize, percentage));
        document.documentElement.style.fontSize = (16 * this.currentSize / 100) + 'px';
        localStorage.setItem('fontSize', this.currentSize);
    }

    increase() {
        this.setFontSize(this.currentSize + this.step);
    }

    decrease() {
        this.setFontSize(this.currentSize - this.step);
    }

    reset() {
        this.setFontSize(100);
    }
}

// Inicializar gerenciador de tamanho de fonte
const fontSizeManager = new FontSizeManager();

// Atalhos para tamanho de fonte
document.addEventListener('keydown', (e) => {
    // Ctrl + + = Aumentar fonte
    if (e.ctrlKey && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        fontSizeManager.increase();
        console.log('Tamanho de fonte aumentado para ' + fontSizeManager.currentSize + '%');
    }

    // Ctrl + - = Diminuir fonte
    if (e.ctrlKey && e.key === '-') {
        e.preventDefault();
        fontSizeManager.decrease();
        console.log('Tamanho de fonte diminuído para ' + fontSizeManager.currentSize + '%');
    }

    // Ctrl + 0 = Reset fonte
    if (e.ctrlKey && e.key === '0') {
        e.preventDefault();
        fontSizeManager.reset();
        console.log('Tamanho de fonte resetado para 100%');
    }
});

console.log('🎯 AgroFortuna - Recursos de Acessibilidade:');
console.log('Alt + D - Alternar modo escuro');
console.log('Alt + V - Ativar leitor de voz');
console.log('Alt + H - Ir para home');
console.log('Alt + C - Ir para contato');
console.log('Ctrl + + - Aumentar tamanho da fonte');
console.log('Ctrl + - - Diminuir tamanho da fonte');
console.log('Ctrl + 0 - Resetar tamanho da fonte');