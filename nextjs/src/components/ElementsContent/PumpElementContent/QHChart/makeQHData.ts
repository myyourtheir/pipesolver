const makeQHData = (a: number, b: number) => {
	const calcH = (Q: number) => {
		return a - b * Q ** 2
	}
	let i = 0
	const arr = []
	let Q = 0
	while (i <= 150) {
		Q = i * 100
		arr.push({
			x: Q,
			y: calcH(Q)
		})
		i += 2
	}
	return arr
}

export default makeQHData