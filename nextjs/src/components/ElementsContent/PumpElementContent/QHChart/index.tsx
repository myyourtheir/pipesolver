import { FC, useEffect, useMemo, useState } from 'react'
import { PumpFormProps } from '../PumpCoefsPopover'
import { Line, Scatter } from 'react-chartjs-2'
import makeQHData from './makeQHData'
import { ChartData } from 'chart.js'
import { QHChartOptions } from './QHСhartOprions'
import { Label } from '@/components/ui/label'
import { QH } from '../QHTable'

interface QHChartProps {
	coefs: { a: number, b: number },
	tableData: QH[]
}
const QHChart: FC<QHChartProps> = ({ coefs, tableData }) => {
	const { a, b } = coefs
	const QHData = makeQHData(a, b, tableData)
	const labels = QHData.map(item => `${item.x} м³/ч`)
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
			<div className='flex justify-center'>
				<Label className=' font-normal'>
					Характеристика насоса
				</Label>
			</div>
			<Scatter data={data} options={QHChartOptions} />
		</div>
	)
}

export default QHChart