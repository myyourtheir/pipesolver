import { GraphNode } from '@/utils/graph/GraphNode'
import { CondParams, ElementParamsUnion, ResultMomentData, Sides, UiConfig } from './stateTypes'

export interface UnsteadyFlowActions {
	updateCondParams: (value: Partial<CondParams>) => void
	addElement: (element: ElementParamsUnion, newUi: UiConfig) => void
	updateElement: (element: ElementParamsUnion, idx: number) => void
	deleteElement: (idx: number) => void
	deleteAll: () => void
	setIsSelected: (idx: number) => void
	setPosition: (element: GraphNode, position: [number, number, number]) => void
	removeOpenSide: (element: GraphNode, side: Sides) => void
	addPipe: (element: ElementParamsUnion, newUi: UiConfig, sourceNode: GraphNode, destinationNode: GraphNode) => void
}
type fnOrValue<T> = T | ((prev: T) => T)
export interface ResultsActions {
	pushNewData: (newData: ResultMomentData) => void
	resetResult: () => void,
	setIter: (val: fnOrValue<number>) => void
}

export type BlockDisplayStoreActions = {
	toggleElementsBar: () => void
	toggleElementsTree: () => void
	toggleResultChart: () => void
	toggleConditionsBar: () => void
}