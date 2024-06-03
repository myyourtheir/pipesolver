import { OneSectionResponse, ResultMomentData } from '../../types/stateTypes'

interface FuncProps {
	data: Array<ResultMomentData>,
	index: number
}
export function getAllMomentDataPerIndex({ data, index }: FuncProps): Array<OneSectionResponse> {
	const result = data[index]?.moment_result && Object.values(data[index]?.moment_result).reduce<Array<OneSectionResponse>>((acc, obj) => {
		acc.push(...obj.value)
		return acc
	}, [])
	return result
}