import { useResultsStore } from '@/lib/globalStore/resultsStore'
import { Chart, Scatter } from 'react-chartjs-2'
import { DavleniyaOptions, NaporyOptions, SkorostyOptions } from '../chartOprions'
import { ChartData, } from 'chart.js'
import { OneSectionResponse, ResultMomentData } from '../../../../../../types/stateTypes'
import { Dispatch, FC, SetStateAction } from 'react'

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
import ChartElementSelector from './ChartElementSelector'
import { useSelectedElementsChartContext } from './SelectedElementsChartContext'

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
	chartData: Array<ResultMomentData>
	index: number,
}

const MyChart: FC<chartProps> = ({ chartData, index }) => {
	const { state: { resultSelectedElementIds } } = useSelectedElementsChartContext()
	if (chartData[index]?.moment_result) {
		const data = resultSelectedElementIds.reduce<Array<OneSectionResponse>>((acc, id) => {
			chartData[index].moment_result[id].value.forEach(obj => acc.push(...Object.values(obj)))
			return acc
		}, [])

		const labels = chartData[index]?.moment_result && chartData[index].moment_result[Object.keys(chartData[index].moment_result)[0]].value.map(el => el.x)
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

			<div className='flex flex-col'>
				<ChartElementSelector />
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
	return 'нет данных'
}


export default MyChart