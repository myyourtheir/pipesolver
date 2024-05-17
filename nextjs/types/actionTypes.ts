import { GraphNode } from '@/utils/graph/GraphNode'
import { CondParams, ConsumerParams, ElementParamsUnion, GateValveParams, PipeParams, ProviderParams, PumpParams, SafeValveParams, UnsteadyChartData } from './stateTypes'

export interface UnsteadyFlowActions {
	updateCondParams: (value: CondParams) => void
	addElement: (element: ElementParamsUnion, sourceNode: GraphNode) => void
	updateElement: (element: ElementParamsUnion, idx: number) => void
	deleteElement: (idx: number) => void
	deleteAll: () => void
	setIsSelected: (idx: number) => void
}
type fnOrValue<T> = T | ((prev: T) => T)
export interface ResultsActions {
	pushNewData: (newData: UnsteadyChartData) => void
	resetResult: () => void,
	setIter: (val: fnOrValue<number>) => void
}