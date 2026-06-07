// ============================================
// MINIGAME.JS - Minigame de Sustentabilidade
// ============================================

const minigameData = [
    {
        question: '🌱 Uma plantação está ressecada. O que fazer?',
        options: [
            { text: 'Ignorar e deixar morrer', impact: -30 },
            { text: 'Ativar sistema de irrigação inteligente', impact: 20 },
            { text: 'Despejar muita água sem controle', impact: -20 },
            { text: 'Descartar a plantação', impact: -25 }
        ]
    },
    {
        question: '🌳 Encontrou uma área sem floresta. Qual ação?',
        options: [
            { text: 'Vender o terreno para construção', impact: -40 },
            { text: 'Iniciar projeto de reflorestamento', impact: 35 },
            { text: 'Deixar como está', impact: -10 },
            { text: 'Usar para piscicultura intensiva', impact: -20 }
        ]
    },
    {
        question: '🐟 Tem oportunidade de expandir a piscicultura. Como?',
        options: [
            { text: 'Método predatório sem sustentabilidade', impact: -35 },
            { text: 'Sistema sustentável com filtros naturais', impact: 25 },
            { text: 'Piscicultura tradicional sem inovação', impact: 5 },
            { text: 'Abandonar a piscicultura', impact: -15 }
        ]
    },
    {
        question: '📊 Necessário aumentar produção. Qual caminho?',
        options: [
            { text: 'Usar pesticidas em excesso', impact: -30 },
            { text: 'Agricultura de precisão com IoT', impact: 30 },
            { text: 'Trabalho manual intensivo', impact: 5 },
            { text: 'Reduzir cultivos', impact: -25 }
        ]
    },
    {
        question: '♻️ Como garantir sustentabilidade a longo prazo?',
        options: [
            { text: 'Foco apenas em lucro imediato', impact: -40 },
            { text: 'Equilibrar lucro, produção e ambiente', impact: 40 },
            { text: 'Parar toda a atividade agrícola', impact: -30 },
            { text: 'Usar tecnologia sem cuidar da natureza', impact: -25 }
        ]
    }
];

let minigameState = {
    questionIndex: 0,
    ecosystemHealth: 100,
    farmProduction: 50,
    score: 0,
    answers: []
};

function renderMinigame() {
    const gameQuestions = document.getElementById('game-questions');
    const gameResult = document.getElementById('game-result');

    if (gameQuestions) {
        gameQuestions.classList.remove('hidden');
    }
    if (gameResult) {
        gameResult.classList.add('hidden');
    }

    renderMinigameQuestion();
}

function renderMinigameQuestion() {
    const gameQuestions = document.getElementById('game-questions');
    if (!gameQuestions) return;

    if (minigameState.questionIndex >= minigameData.length) {
        showMinigameResults();
        return;
    }

    const question = minigameData[minigameState.questionIndex];
    let html = `<div class="game-question"><h4>${question.question}</h4><div class="game-options">`;

    question.options.forEach((option, index) => {
        html += `
            <button class="game-option-btn" onclick="selectMinigameOption(${minigameState.questionIndex}, ${index}, ${option.impact})">
                ${option.text}
            </button>
        `;
    });

    html += `</div></div>`;
    gameQuestions.innerHTML = html;
}

function selectMinigameOption(questionIndex, optionIndex, impact) {
    const question = minigameData[questionIndex];
    const option = question.options[optionIndex];

    // Atualizar saúde do ecossistema
    minigameState.ecosystemHealth = Math.max(0, Math.min(100, minigameState.ecosystemHealth + impact));

    // Atualizar produção
    if (impact > 0) {
        minigameState.farmProduction = Math.max(0, Math.min(100, minigameState.farmProduction + (impact / 2)));
        minigameState.score += impact;
    } else {
        minigameState.farmProduction = Math.max(0, Math.min(100, minigameState.farmProduction + (impact / 2)));
        minigameState.score += Math.abs(impact);
    }

    // Atualizar UI
    updateGameStats();

    // Próxima pergunta
    minigameState.questionIndex++;
    setTimeout(() => renderMinigameQuestion(), 500);
}

function updateGameStats() {
    const ecosystemBar = document.getElementById('ecosystem-health');
    const farmBar = document.getElementById('farm-production');
    const ecosystemPercent = document.getElementById('ecosystem-percent');
    const productionPercent = document.getElementById('production-percent');

    if (ecosystemBar) {
        ecosystemBar.style.width = minigameState.ecosystemHealth + '%';
    }
    if (farmBar) {
        farmBar.style.width = minigameState.farmProduction + '%';
    }
    if (ecosystemPercent) {
        ecosystemPercent.textContent = Math.round(minigameState.ecosystemHealth) + '%';
    }
    if (productionPercent) {
        productionPercent.textContent = Math.round(minigameState.farmProduction) + '%';
    }
}

function showMinigameResults() {
    const gameQuestions = document.getElementById('game-questions');
    const gameResult = document.getElementById('game-result');

    if (gameQuestions) {
        gameQuestions.classList.add('hidden');
    }
    if (gameResult) {
        gameResult.classList.remove('hidden');
        document.getElementById('final-score').textContent = Math.round(minigameState.score);

        let feedback = '';
        if (minigameState.ecosystemHealth >= 80 && minigameState.farmProduction >= 70) {
            feedback = '🏆 Excelente! Você alcançou equilíbrio perfeito entre sustentabilidade e produção!';
        } else if (minigameState.ecosystemHealth >= 60 && minigameState.farmProduction >= 50) {
            feedback = '🌱 Bom trabalho! Você manteve um equilíbrio razoável, mas pode melhorar!';
        } else if (minigameState.ecosystemHealth >= 40) {
            feedback = '⚠️ Atenção! A saúde do ecossistema está comprometida, revise suas estratégias!';
        } else {
            feedback = '❌ Você falhou em manter a sustentabilidade. Tente novamente e aprenda com seus erros!';
        }

        document.getElementById('final-feedback').textContent = feedback;
    }
}

function resetMinigame() {
    minigameState = {
        questionIndex: 0,
        ecosystemHealth: 100,
        farmProduction: 50,
        score: 0,
        answers: []
    };
    updateGameStats();
    renderMinigame();
}

// Inicializar minigame
document.addEventListener('DOMContentLoaded', () => {
    renderMinigame();
});