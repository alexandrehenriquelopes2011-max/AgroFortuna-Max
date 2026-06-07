// ============================================
// QUIZ.JS - Sistema de Quiz Interativo
// ============================================

const quizData = [
    {
        question: '1. Qual é o principal benefício da agricultura sustentável?',
        options: [
            { text: 'Aumentar lucros imediatamente', correct: false },
            { text: 'Preservar o meio ambiente enquanto mantém a produção', correct: true },
            { text: 'Eliminar a necessidade de fertilizantes', correct: false },
            { text: 'Reduzir o tamanho das plantações', correct: false }
        ]
    },
    {
        question: '2. O que é reflorestamento?',
        options: [
            { text: 'Cortar árvores velhas', correct: false },
            { text: 'Plantar novas árvores em áreas desmatadas', correct: true },
            { text: 'Proteger apenas animais', correct: false },
            { text: 'Construir casas em florestas', correct: false }
        ]
    },
    {
        question: '3. Qual tecnologia monitora a saúde das plantações em tempo real?',
        options: [
            { text: 'Sensores IoT', correct: true },
            { text: 'Vídeo cassete', correct: false },
            { text: 'Rádio AM', correct: false },
            { text: 'Telegrama', correct: false }
        ]
    },
    {
        question: '4. Quantas toneladas de alimentos sustentáveis são produzidas por ano no Paraná?',
        options: [
            { text: '1.000.000 ton/ano', correct: false },
            { text: '2.800.000 ton/ano', correct: true },
            { text: '500.000 ton/ano', correct: false },
            { text: '5.000.000 ton/ano', correct: false }
        ]
    },
    {
        question: '5. O que é piscicultura?',
        options: [
            { text: 'Criação de peixes em cativeiro', correct: true },
            { text: 'Pesca predatória em rios', correct: false },
            { text: 'Construção de barragens', correct: false },
            { text: 'Agricultura em terrenos montanhosos', correct: false }
        ]
    },
    {
        question: '6. Qual é a cobertura florestal aproximada de Itambaracá?',
        options: [
            { text: '15%', correct: false },
            { text: '42%', correct: true },
            { text: '75%', correct: false },
            { text: '90%', correct: false }
        ]
    },
    {
        question: '7. O que é agricultura de precisão?',
        options: [
            { text: 'Plantar manualmente', correct: false },
            { text: 'Usar GPS e drones para otimizar plantações', correct: true },
            { text: 'Usar apenas ferramentas antigas', correct: false },
            { text: 'Trabalhar sem tecnologia', correct: false }
        ]
    },
    {
        question: '8. Qual é o estado que mais produz piscicultura sustentável?',
        options: [
            { text: 'Paraná', correct: true },
            { text: 'Amazonas', correct: false },
            { text: 'Bahia', correct: false },
            { text: 'Goiás', correct: false }
        ]
    },
    {
        question: '9. Quantas espécies protegidas existem na região de Itambaracá?',
        options: [
            { text: '50 espécies', correct: false },
            { text: '156 espécies', correct: true },
            { text: '300 espécies', correct: false },
            { text: '500 espécies', correct: false }
        ]
    },
    {
        question: '10. Qual é o objetivo principal da AgroFortuna?',
        options: [
            { text: 'Vender fertilizantes caros', correct: false },
            { text: 'Informar, educar e engajar sobre sustentabilidade', correct: true },
            { text: 'Eliminar pequenos agricultores', correct: false },
            { text: 'Promover desmatamento', correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = [];

function renderQuiz() {
    const quizContent = document.getElementById('quiz-content');
    const quizResult = document.getElementById('quiz-result');

    if (quizContent) {
        quizContent.classList.remove('hidden');
    }
    if (quizResult) {
        quizResult.classList.add('hidden');
    }

    renderQuestion();
}

function renderQuestion() {
    const quizContent = document.getElementById('quiz-content');
    if (!quizContent) return;

    if (currentQuestionIndex >= quizData.length) {
        showResults();
        return;
    }

    const question = quizData[currentQuestionIndex];
    let html = `
        <div class="quiz-question">
            <h4>${question.question}</h4>
            <div class="quiz-options">
    `;

    question.options.forEach((option, index) => {
        html += `
            <label class="quiz-option">
                <input type="radio" name="answer-${currentQuestionIndex}" value="${index}" onchange="selectAnswer(${currentQuestionIndex}, ${index}, ${option.correct})">
                <span>${option.text}</span>
            </label>
        `;
    });

    html += `
            </div>
            <button class="cta-button" style="margin-top: 20px; width: 100%;" onclick="nextQuestion()">
                Próxima Pergunta ${currentQuestionIndex + 1}/${quizData.length}
            </button>
        </div>
    `;

    quizContent.innerHTML = html;
}

function selectAnswer(questionIndex, optionIndex, isCorrect) {
    const optionLabels = document.querySelectorAll('.quiz-option');
    optionLabels.forEach((label, index) => {
        const input = label.querySelector('input');
        if (input.value == optionIndex) {
            if (isCorrect) {
                label.classList.add('correct');
                answeredQuestions.push({ question: questionIndex, correct: true });
                score++;
            } else {
                label.classList.add('incorrect');
                answeredQuestions.push({ question: questionIndex, correct: false });
            }
        }
    });
}

function nextQuestion() {
    if (!answeredQuestions.some(a => a.question === currentQuestionIndex)) {
        alert('Por favor, selecione uma resposta!');
        return;
    }
    currentQuestionIndex++;
    renderQuestion();
}

function showResults() {
    const quizContent = document.getElementById('quiz-content');
    const quizResult = document.getElementById('quiz-result');

    if (quizContent) {
        quizContent.classList.add('hidden');
    }
    if (quizResult) {
        quizResult.classList.remove('hidden');
        document.getElementById('quiz-score').textContent = score;

        let feedback = '';
        const percentage = (score / quizData.length) * 100;

        if (percentage === 100) {
            feedback = '🌟 Perfeito! Você é um especialista em sustentabilidade!';
        } else if (percentage >= 80) {
            feedback = '🌱 Excelente! Você tem muito conhecimento sobre o tema!';
        } else if (percentage >= 60) {
            feedback = '👍 Bom! Você aprendeu bastante, mas continue estudando!';
        } else if (percentage >= 40) {
            feedback = '📚 Você está no caminho certo, continue aprendendo!';
        } else {
            feedback = '🌍 Volte e explore mais sobre sustentabilidade!';
        }

        document.getElementById('quiz-feedback').textContent = feedback;
    }
}

function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    answeredQuestions = [];
    renderQuiz();
}

// Inicializar quiz
document.addEventListener('DOMContentLoaded', () => {
    renderQuiz();
});