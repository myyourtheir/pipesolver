import { ChartOptions } from 'chart.js'

export const QHChartOptions: ChartOptions<'scatter'> = {

	animation: false,
	responsive: true,
	elements: {
		point: {
			radius: 0,
			hitRadius: 1
		},
		line: {
			borderWidth: 1,
			borderCapStyle: 'round',
		}
	},
	showLine: true,

	scales: {
		x: {
			ticks: {
				callback: (value) => `${value} м³/ч`,
				maxRotation: 0,
				autoSkip: true,
			},
			offset: false
		},
		y: {
			ticks: {
				callback: (value) => `${typeof value === 'number' && value.toFixed()} м`
			},
		}
	},
	plugins: {
		legend: {
			display: false,
		},
		tooltip: {
			enabled: true,
			mode: 'index',
			intersect: false,
			callbacks: {
				label: function (context) {
					let label = context.dataset.label || ''
					if (label) {
						label += ': '
					}
					if (context.parsed.y !== null) {
						label += context.parsed.y.toFixed(1)
						label += ' м'
					}
					return label
				}
			},
		},

	}
}
