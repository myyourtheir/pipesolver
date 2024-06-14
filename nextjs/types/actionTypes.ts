import { GraphNode } from '@/utils/graph/GraphNode'
import { CondParams, ElementParamsUnion, ResultMomentData, UiConfig } from './stateTypes'

export interface UnsteadyFlowActions {
	updateCondParams: (value: Partial<CondParams>) => void
	addElement: (element: ElementParamsUnion) => void
	updateElement: (element: ElementParamsUnion, idx: number) => void
	deleteElement: (idx: number) => void
	deleteAll: () => void
	setIsSelected: (idx: number) => void
}
type fnOrValue<T> = T | ((prev: T) => T)
export interface ResultsActions {
	pushNewData: (newData: ResultMomentData) => void
	resetResult: () => void,
	setIter: (val: fnOrValue<number>) => void
}