import { useResultsStore } from '@/lib/globalStore/resultsStore'
import { Chart, Scatter } from 'react-chartjs-2'
import { DavleniyaOptions, NaporyOptions, SkorostyOptions } from './chartOprions'
import { ChartData, } from 'chart.js'
import { UnsteadyChartData } from '../../../../../types/stateTypes'
import { FC } from 'react'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	registerables
} from 'chart.js'

ChartJS.register(
	...registerables,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
)


interface chartProps {
	data: UnsteadyChartData
}

const MyChart: FC<chartProps> = ({ data }) => {
	const naporyData: ChartData<"scatter"> = {
		datasets: [
			{
				type: 'scatter',
				data: data.Napory,
				label: "Напор",
				borderColor: 'red',
				backgroundColor: 'red'
			},
		],

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
				backgroundColor: 'green',
			},
		]
	}


	return (
		<>
			<Scatter
				options={NaporyOptions}
				data={naporyData} />
			<Scatter
				options={DavleniyaOptions}
				data={davleniyaData} />
			<Scatter
				options={SkorostyOptions}
				data={skorostyData} />

		</>
	)
}


export default MyChart