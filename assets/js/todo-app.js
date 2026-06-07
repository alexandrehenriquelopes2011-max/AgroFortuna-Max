// ============================================
// TODO APP - APLICAÇÃO DE GERENCIADOR DE TAREFAS
// ============================================

class TodoApp {
    constructor() {
        this.tasks = [];
        this.categories = [];
        this.currentFilter = 'all';
        this.currentCategory = null;
        this.currentSort = 'date-desc';
        this.selectedColor = '#FF6B6B';
        this.settings = {
            notifications: true,
            sound: true,
            autoDelete: false
        };

        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupDefaultCategories();
        this.render();
    }

    setupEventListeners() {
        // Task input
        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Filter buttons
        document.getElementById('filterAllBtn').addEventListener('click', () => this.setFilter('all'));
        document.getElementById('filterActiveBtn').addEventListener('click', () => this.setFilter('active'));
        document.getElementById('filterCompleteBtn').addEventListener('click', () => this.setFilter('completed'));

        // Sort button
        document.getElementById('sortBtn').addEventListener('click', () => this.openSortModal());

        // Dark mode
        document.getElementById('darkModeBtn').addEventListener('click', () => this.toggleDarkMode());

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettingsModal());
        document.getElementById('addCategoryBtn').addEventListener('click', () => this.openAddCategoryModal());

        // Settings toggles
        document.getElementById('notificationsToggle').addEventListener('change', (e) => {
            this.settings.notifications = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('soundToggle').addEventListener('change', (e) => {
            this.settings.sound = e.target.checked;
            this.saveSettings();
        });
        document.getElementById('autoDeleteToggle').addEventListener('change', (e) => {
            this.settings.autoDelete = e.target.checked;
            this.saveSettings();
        });

        // Import file input
        document.getElementById('importFile').addEventListener('change', (e) => this.importFromFile(e));
    }

    setupDefaultCategories() {
        if (this.categories.length === 0) {
            this.categories = [
                { id: 1, name: 'Trabalho', color: '#667eea' },
                { id: 2, name: 'Pessoal', color: '#764ba2' },
                { id: 3, name: 'Compras', color: '#4ECDC4' },
                { id: 4, name: 'Saúde', color: '#FF6B6B' },
                { id: 5, name: 'Estudos', color: '#45B7D1' }
            ];
            this.saveData();
        }
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const categorySelect = document.getElementById('categorySelect');
        const prioritySelect = document.getElementById('prioritySelect');
        const text = input.value.trim();

        if (!text) {
            this.showToast('Por favor, digite uma tarefa', 'warning');
            return;
        }

        const task = {
            id: Date.now(),
            text,
            completed: false,
            category: categorySelect.value || '1',
            priority: prioritySelect.value,
            createdAt: new Date(),
            completedAt: null
        };

        this.tasks.unshift(task);
        this.saveData();
        this.render();
        input.value = '';

        if (this.settings.sound) this.playSound();
        this.showToast('Tarefa adicionada com sucesso!');
    }

    deleteTask(id) {
        if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveData();
            this.render();
            this.showToast('Tarefa deletada');
        }
    }

    toggleTaskComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date() : null;
            this.saveData();
            this.render();
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.closest('.filter-btn').classList.add('active');
        this.render();
    }

    setCategory(id) {
        this.currentCategory = this.currentCategory === id ? null : id;
        this.render();
    }

    getFilteredTasks() {
        let filtered = this.tasks;

        if (this.currentFilter === 'active') {
            filtered = filtered.filter(t => !t.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(t => t.completed);
        }

        if (this.currentCategory) {
            filtered = filtered.filter(t => t.category === this.currentCategory.toString());
        }

        filtered = this.sortTasks(filtered);

        return filtered;
    }

    sortTasks(tasks) {
        const sorted = [...tasks];
        
        switch (this.currentSort) {
            case 'date-asc':
                sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'date-desc':
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'priority-high':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
            case 'priority-low':
                const priorityOrderLow = { low: 0, medium: 1, high: 2 };
                sorted.sort((a, b) => priorityOrderLow[a.priority] - priorityOrderLow[b.priority]);
                break;
            case 'name-asc':
                sorted.sort((a, b) => a.text.localeCompare(b.text));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.text.localeCompare(a.text));
                break;
        }

        return sorted;
    }

    render() {
        this.renderCategories();
        this.renderTasks();
        this.updateStatistics();
        this.updateFilterCounts();
        this.updateCategorySelect();
    }

    renderCategories() {
        const container = document.getElementById('categoriesList');
        container.innerHTML = this.categories.map(cat => `
            <div class="category-item ${this.currentCategory == cat.id ? 'active' : ''}" onclick="app.setCategory(${cat.id})">
                <div class="category-color" style="background-color: ${cat.color}"></div>
                <span>${cat.name}</span>
                <span class="category-count">${this.tasks.filter(t => t.category === cat.id.toString()).length}</span>
                <button class="category-delete" onclick="event.stopPropagation(); app.deleteCategory(${cat.id}); "><i class="fas fa-times"></i></button>
            </div>
        `).join('');
    }

    renderTasks() {
        const container = document.getElementById('tasksList');
        const filtered = this.getFilteredTasks();

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>Nenhuma tarefa encontrada</p>
                    <small>Crie uma nova tarefa para começar</small>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(task => {
            const category = this.categories.find(c => c.id.toString() === task.category);
            const date = new Date(task.createdAt).toLocaleDateString('pt-BR');

            return `
                <div class="task-item ${task.completed ? 'completed' : ''} priority-${task.priority}">
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        ${task.completed ? 'checked' : ''}
                        onchange="app.toggleTaskComplete(${task.id})"
                    >
                    <div class="priority-badge"></div>
                    <div class="task-content">
                        <div class="task-header">
                            <span class="task-text">${this.escapeHtml(task.text)}</span>
                            ${category ? `<span class="task-category" style="background-color: ${category.color}">${category.name}</span>` : ''}
                        </div>
                        <div class="task-meta">
                            <span class="task-date"><i class="fas fa-calendar"></i> ${date}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="task-btn edit-btn" onclick="app.editTask(${task.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="task-btn delete-btn" onclick="app.deleteTask(${task.id})" title="Deletar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateStatistics() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
        document.getElementById('progressPercent').textContent = percent + '%';
    }

    updateFilterCounts() {
        const total = this.tasks.length;
        const active = this.tasks.filter(t => !t.completed).length;
        const completed = this.tasks.filter(t => t.completed).length;

        document.querySelector('#filterAllBtn .count').textContent = total;
        document.querySelector('#filterActiveBtn .count').textContent = active;
        document.querySelector('#filterCompleteBtn .count').textContent = completed;
    }

    updateCategorySelect() {
        const select = document.getElementById('categorySelect');
        select.innerHTML = this.categories.map(cat => 
            `<option value="${cat.id}">${cat.name}</option>`
        ).join('');
    }

    deleteCategory(id) {
        if (confirm('Tem certeza que deseja deletar esta categoria?')) {
            this.categories = this.categories.filter(c => c.id !== id);
            this.tasks.forEach(task => {
                if (task.category === id.toString()) {
                    task.category = this.categories[0]?.id.toString() || '1';
                }
            });
            this.saveData();
            this.render();
        }
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    }

    openSortModal() {
        document.getElementById('sortModal').classList.add('active');
    }

    openSettingsModal() {
        document.getElementById('notificationsToggle').checked = this.settings.notifications;
        document.getElementById('soundToggle').checked = this.settings.sound;
        document.getElementById('autoDeleteToggle').checked = this.settings.autoDelete;
        document.getElementById('settingsModal').classList.add('active');
    }

    openAddCategoryModal() {
        document.getElementById('addCategoryModal').classList.add('active');
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            const newText = prompt('Editar tarefa:', task.text);
            if (newText && newText.trim()) {
                task.text = newText.trim();
                this.saveData();
                this.render();
                this.showToast('Tarefa atualizada');
            }
        }
    }

    clearAllTasks() {
        if (confirm('Tem certeza que deseja deletar TODAS as tarefas? Esta ação não pode ser desfeita!')) {
            this.tasks = [];
            this.saveData();
            this.render();
            this.showToast('Todas as tarefas foram deletadas');
            document.getElementById('settingsModal').classList.remove('active');
        }
    }

    exportData() {
        const data = {
            tasks: this.tasks,
            categories: this.categories,
            exportedAt: new Date().toISOString()
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tarefas-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Dados exportados com sucesso');
    }

    importData() {
        document.getElementById('importFile').click();
    }

    importFromFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.tasks && data.categories) {
                    this.tasks = data.tasks;
                    this.categories = data.categories;
                    this.saveData();
                    this.render();
                    this.showToast('Dados importados com sucesso');
                    document.getElementById('settingsModal').classList.remove('active');
                } else {
                    this.showToast('Arquivo inválido', 'error');
                }
            } catch (error) {
                this.showToast('Erro ao importar arquivo', 'error');
            }
        };
        reader.readAsText(file);
    }

    saveData() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        localStorage.setItem('categories', JSON.stringify(this.categories));
    }

    loadData() {
        const savedTasks = localStorage.getItem('tasks');
        const savedCategories = localStorage.getItem('categories');

        if (savedTasks) this.tasks = JSON.parse(savedTasks);
        if (savedCategories) this.categories = JSON.parse(savedCategories);

        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'true') {
            document.body.classList.add('dark-mode');
        }

        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            this.settings = JSON.parse(savedSettings);
        }
    }

    saveSettings() {
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    playSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

function closeSortModal() {
    document.getElementById('sortModal').classList.remove('active');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('active');
}

function closeAddCategoryModal() {
    document.getElementById('addCategoryModal').classList.remove('active');
}

function selectColor(color) {
    app.selectedColor = color;
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.style.borderColor = btn.style.backgroundColor === color ? '#333' : 'transparent';
    });
}

function sortTasks(sort) {
    app.currentSort = sort;
    app.render();
    closeSortModal();
}

function confirmAddCategory() {
    const input = document.getElementById('categoryInput');
    const name = input.value.trim();

    if (!name) {
        app.showToast('Por favor, digite um nome para a categoria', 'warning');
        return;
    }

    const newCategory = {
        id: Math.max(0, ...app.categories.map(c => c.id)) + 1,
        name,
        color: app.selectedColor
    };

    app.categories.push(newCategory);
    app.saveData();
    app.render();
    input.value = '';
    closeAddCategoryModal();
    app.showToast('Categoria adicionada');
}

document.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
});
