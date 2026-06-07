// ============================================
// CHARTS.JS - Gráficos com Chart.js
// ============================================

const chartConfigs = {
    forestChart: {
        elementId: 'forestChart',
        label: 'Cobertura Florestal (últimos 30 anos)',
        data: [18, 19, 20, 21, 22, 24, 26, 27, 29, 31, 32, 34, 35, 36, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 50, 51, 52],
        borderColor: '#2d5016',
        backgroundColor: 'rgba(45, 80, 22, 0.1)'
    },
    agricultureChart: {
        elementId: 'agricultureChart',
        label: 'Produção Agrícola Sustentável (ton/ano)',
        data: [50000, 55000, 62000, 70000, 78000, 85000, 92000, 100000, 108000, 115000, 122000, 128000, 134000, 140000, 145000, 150000, 156000, 162000, 168000, 175000, 180000, 185000, 190000, 195000, 200000, 210000, 220000, 225000, 230000, 235000],
        borderColor: '#7cb342',
        backgroundColor: 'rgba(123, 179, 66, 0.1)'
    },
    reforestChart: {
        elementId: 'reforestChart',
        label: 'Hectares Reflorestados (ha/ano)',
        data: [500, 600, 800, 1000, 1200, 1500, 1800, 2100, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8200, 8400, 8600, 8800, 9000, 9200, 9400, 9600, 9800, 10000],
        borderColor: '#558b2f',
        backgroundColor: 'rgba(85, 139, 47, 0.1)'
    },
    fisheryChart: {
        elementId: 'fisheryChart',
        label: 'Produção de Piscicultura Sustentável (ton/ano)',
        data: [2000, 2200, 2500, 2800, 3100, 3500, 3900, 4300, 4800, 5300, 5800, 6300, 6800, 7300, 7800, 8200, 8600, 9000, 9500, 10000, 10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000, 14500, 15000],
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)'
    }
};

function createCharts() {
    Object.values(chartConfigs).forEach(config => {
        const canvas = document.getElementById(config.elementId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const years = Array.from({ length: 30 }, (_, i) => {
            const year = new Date().getFullYear() - 30 + i;
            return year.toString();
        });

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: config.label,
                    data: config.data,
                    borderColor: config.borderColor,
                    backgroundColor: config.backgroundColor,
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointBackgroundColor: config.borderColor,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 13,
                                weight: 'bold'
                            }
                        }
                    },
                    filler: {
                        propagate: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('pt-BR');
                            }
                        },
                        grid: {
                            drawBorder: false,
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    });
}

// Inicializar gráficos quando Chart.js estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que Chart.js foi carregado
    setTimeout(() => {
        if (typeof Chart !== 'undefined') {
            createCharts();
        }
    }, 100);
});