let priceChart;

export function initChart(ctx) {
    const data = {
        datasets: [{
            label: '代币价格 (SOL)',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    priceChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute',
                        displayFormats: {
                            minute: 'HH:mm'
                        }
                    },
                    title: {
                        display: true,
                        text: '时间'
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: '价格 (SOL)'
                    }
                }
            }
        }
    });
}

export function updateChart(price, timestamp) {
    const time = moment(timestamp);
    priceChart.data.datasets[0].data.push({x: time, y: price});

    if (priceChart.data.datasets[0].data.length > 20) {
        priceChart.data.datasets[0].data.shift();
    }

    priceChart.update();
}

export function resetChart() {
    priceChart.data.datasets[0].data = [];
    priceChart.update();
}