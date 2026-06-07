// ============================================
// LEAVES.JS - Folhas Caindo com Física Realista
// ============================================

class FallingLeaf {
    constructor(container) {
        this.container = container;
        this.element = document.createElement('div');
        this.element.className = 'leaf';
        this.element.innerHTML = '<i class="fas fa-leaf"></i>';
        
        this.x = Math.random() * window.innerWidth;
        this.y = -50;
        this.size = Math.random() * 20 + 15;
        this.duration = Math.random() * 10 + 15;
        this.delay = Math.random() * 5;
        this.rotate = Math.random() * 360;
        this.swayAmount = Math.random() * 100 + 50;
        
        this.element.style.left = this.x + 'px';
        this.element.style.width = this.size + 'px';
        this.element.style.height = this.size + 'px';
        this.element.style.fontSize = (this.size * 0.8) + 'px';
        this.element.style.animation = `fall ${this.duration}s linear ${this.delay}s infinite`;
        this.element.style.opacity = Math.random() * 0.5 + 0.4;
        
        this.container.appendChild(this.element);
    }

    remove() {
        this.element.remove();
    }
}

class LeavesSystem {
    constructor() {
        this.container = document.getElementById('leaves-container');
        if (!this.container) return;

        this.leaves = [];
        this.maxLeaves = 15;
        this.createLeaves();
        this.startLeavesFalling();
    }

    createLeaves() {
        for (let i = 0; i < this.maxLeaves; i++) {
            const leaf = new FallingLeaf(this.container);
            this.leaves.push(leaf);
        }
    }

    startLeavesFalling() {
        setInterval(() => {
            // Remover algumas folhas aleatoriamente
            if (this.leaves.length < this.maxLeaves) {
                const leaf = new FallingLeaf(this.container);
                this.leaves.push(leaf);
            }
        }, 3000);
    }

    stop() {
        this.leaves.forEach(leaf => leaf.remove());
        this.leaves = [];
    }
}

// Inicializar sistema de folhas
document.addEventListener('DOMContentLoaded', () => {
    new LeavesSystem();
});