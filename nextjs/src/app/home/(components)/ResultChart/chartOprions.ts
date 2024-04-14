import { ChartOptions } from 'chart.js'


export const chartOptions: ChartOptions<'scatter'> = {
	animation: false,
	elements: {
		point: {
			radius: 0,
			hitRadius: 0
		},
		line: {
			borderWidth: 1,
			borderCapStyle: 'round',
		}
	},
	showLine: true,

}
