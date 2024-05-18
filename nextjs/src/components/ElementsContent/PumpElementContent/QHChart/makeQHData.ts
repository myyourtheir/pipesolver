import { QH } from '../QHTable'

const makeQHData = (a: number, b: number, tableData: QH[]) => {
	const calcH = (Q: number) => {
		return Number((a - b * Q ** 2).toFixed(1))
	}
	const maxQ = tableData.reduce((acc, item) => {
		return item.Q > acc ? item.Q : acc
	}, 0)
	const arr = []
	let Q = 0
	const dQ = maxQ / 200
	while (Q <= maxQ * 1.2) {
		arr.push({
			x: Number(Q.toFixed(1)),
			y: calcH(Q)
		})
		Q += dQ
	}
	return arr
}

export default makeQHData