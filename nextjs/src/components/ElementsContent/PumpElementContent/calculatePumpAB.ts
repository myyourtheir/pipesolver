import { QH } from '@/components/ElementsContent/PumpElementContent/QHTable'

interface SumType {
	SumH: number,
	SumQ2: number,
	SumHQ2: number,
	SumQ4: number,
}
function calculatePumpAB(data: QH[]) {
	const prepCalc = data.map(QH => {
		const Q2 = QH.Q ** 2
		const HQ2 = QH.Q ** 2 * QH.H
		const Q4 = QH.Q ** 4
		return {
			H: QH.H,
			Q2,
			HQ2,
			Q4
		}
	}).reduce((acc, item) => {
		acc.SumH += item.H
		acc.SumQ2 += item.Q2
		acc.SumHQ2 += item.HQ2
		acc.SumQ4 += item.Q4
		return acc
	}, {
		SumH: 0,
		SumQ2: 0,
		SumHQ2: 0,
		SumQ4: 0,
	})
	const { SumH, SumHQ2, SumQ2, SumQ4 } = prepCalc
	return {
		a: parseFloat(((SumHQ2 * SumQ2 - SumQ4 * SumH) / (SumQ2 ** 2 - SumQ4 * data.length)).toFixed(2)),
		b: parseFloat(((data.length * SumHQ2 - SumH * SumQ2) / (SumQ2 ** 2 - SumQ4 * data.length)).toFixed(9))
	}
}

export default calculatePumpAB