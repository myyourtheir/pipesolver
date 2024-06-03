import { useResultsStore } from '@/lib/globalStore/resultsStore'
import { Chart, Scatter } from 'react-chartjs-2'
import { DavleniyaOptions, NaporyOptions, SkorostyOptions } from './chartOprions'
import { ChartData, } from 'chart.js'
import { OneSectionResponse, ResultMomentData } from '../../../../../types/stateTypes'
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
	data: Array<OneSectionResponse>
}

const MyChart: FC<chartProps> = ({ data }) => {
	const labels = data.map(obj => {
		return `${obj?.x} м`
	})
	const naporyData: ChartData<"scatter", OneSectionResponse[]> = {
		labels,
		datasets: [
			{
				type: 'scatter',
				data: data,
				parsing: {
					xAxisKey: 'x',
					yAxisKey: 'H'
				},
				label: "Напор",
				borderColor: 'red',
				backgroundColor: 'red'
			},
		],
	}
	const davleniyaData: ChartData<"scatter", OneSectionResponse[]> = {
		labels,
		datasets: [
			{
				type: 'scatter',
				data: data,
				parsing: {
					xAxisKey: 'x',
					yAxisKey: 'p'
				},
				label: "Давление",
				borderColor: 'blue',
				backgroundColor: 'blue'
			},
		]
	}
	const skorostyData: ChartData<"scatter", OneSectionResponse[]> = {
		labels,
		datasets: [
			{
				type: 'scatter',
				data: data,
				parsing: {
					xAxisKey: 'x',
					yAxisKey: 'V'
				},
				label: "Скорость",
				borderColor: 'green',
				backgroundColor: 'green',
			},
		]
	}


	return (
		<div>
			<Scatter
				options={NaporyOptions}
				data={naporyData} />
			<Scatter
				options={DavleniyaOptions}
				data={davleniyaData} />
			<Scatter
				options={SkorostyOptions}
				data={skorostyData} />

		</div>
	)
}


export default MyChart