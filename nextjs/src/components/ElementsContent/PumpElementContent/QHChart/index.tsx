import { FC, useEffect, useMemo, useState } from 'react'
import { PumpFormProps } from '../PumpCoefsPopover'
import { Line, Scatter } from 'react-chartjs-2'
import makeQHData from './makeQHData'
import { ChartData } from 'chart.js'
import { QHChartOptions } from './QHСhartOprions'

interface QHChartProps {
	coefs: { a: number, b: number }
}
const QHChart: FC<QHChartProps> = ({ coefs }) => {
	const { a, b } = coefs
	console.log(a, b)
	const QHData = makeQHData(a, b)
	const labels = QHData.map(item => `${item.x} м3/ч`)
	const data: ChartData<"scatter"> = {
		labels: labels,
		datasets: [
			{
				type: 'scatter',
				data: QHData,
				label: "Напор",
				borderColor: 'red',
				backgroundColor: 'red'
			},
		],

	}
	return (
		<div>
			<Scatter data={data} options={QHChartOptions} />
		</div>
	)
}

export default QHChart