import { OneSectionResponse, ResultMomentData } from '../../../../../types/stateTypes'
interface FuncProps {
	data: Array<ResultMomentData>,
	index: number
}
const buildChartData = ({ data, index }: FuncProps) => {
	const result = data[index]?.moment_result && Object.values(data[index]?.moment_result).reduce<Array<OneSectionResponse>>((acc, obj) => {
		obj.value.forEach((o) => {
			acc.push(...Object.values(o))
		})
		return acc
	}, [])
	return result
}

export default buildChartData



