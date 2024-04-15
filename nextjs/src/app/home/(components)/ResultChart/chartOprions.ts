import { ChartOptions } from 'chart.js'

const globalOptions: ChartOptions<'scatter'> = {
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
}

export const DavleniyaOptions: ChartOptions<'scatter'> = {
	...globalOptions,
	scales: {
		x: {
			ticks: {
				callback: (value) => `${value} м`,
				maxRotation: 0,
				autoSkip: true,
			},
			offset: false
		},
		y: {
			ticks: {
				callback: (value) => `${typeof value === 'number' && value.toFixed(1)} Мпа`
			},
		}
	},
	plugins: {
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
						label += ' МПа'
					}
					return label
				}
			},
		},

	}
}
export const NaporyOptions: ChartOptions<'scatter'> = {
	...globalOptions,
	scales: {
		x: {
			ticks: {
				callback: (value) => `${value} м`,
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
						label += context.parsed.y.toFixed(2)
						label += ' м'
					}
					return label
				}
			},
		},
	}
}
export const SkorostyOptions: ChartOptions<'scatter'> = {
	...globalOptions,
	scales: {
		x: {
			ticks: {
				callback: (value) => `${value} м`,
				maxRotation: 0,
				autoSkip: true,
			},
			offset: false
		},
		y: {
			ticks: {
				callback: (value) => `${typeof value === 'number' && value.toFixed(1)} м/с`
			},
		}
	},
	plugins: {
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
						label += context.parsed.y.toFixed(2)
						label += ' м/с'
					}
					return label
				}
			},
		},
	}
}
