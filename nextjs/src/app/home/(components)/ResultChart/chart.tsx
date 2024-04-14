import { useResultsStore } from '@/lib/globalStore/resultsStore'
import { Chart, Scatter } from 'react-chartjs-2'
import { chartOptions } from './chartOprions'
import { ChartData, } from 'chart.js'
import { UnsteadyChartData } from '../../../../../types/stateTypes'
import { FC } from 'react'
import {
	Chart as ChartJS,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
} from 'chart.js'
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)


interface chartProps {
	data: UnsteadyChartData
}
const MyChart: FC<chartProps> = ({ data }) => {
	const naporiData: ChartData<"scatter"> = {
		datasets: [
			{
				type: 'scatter',
				data: data.Napory,
				label: "Напор",
				borderColor: 'red',
				backgroundColor: 'red'
			},
		]
	}
	const davleniyaData: ChartData<"scatter"> = {
		datasets: [
			{
				type: 'scatter',
				data: data.Davleniya,
				label: "Давление",
				borderColor: 'blue',
				backgroundColor: 'blue'
			},
		]
	}
	const skorostyData: ChartData<"scatter"> = {
		datasets: [
			{
				type: 'scatter',
				data: data.Skorosty,
				label: "Скорость",
				borderColor: 'green',
				backgroundColor: 'green'
			},
		]
	}


	return (
		<>
			<Scatter
				options={chartOptions}
				data={naporiData} />
			<Scatter
				options={chartOptions}
				data={davleniyaData} />
			<Scatter
				options={chartOptions}
				data={skorostyData} />

		</>
	)
}


export default MyChart