import { CondParams, ConsumerParams, GateValveParams, PipeParams, ProviderParams, PumpParams, SafeValveParams, UnsteadyChartData } from './stateTypes'

export interface UnsteadyFlowActions {
	updateCondParams: (prop: keyof CondParams, value: CondParams[keyof CondParams]) => void
	addElement: (element: PipeParams | PumpParams | GateValveParams | SafeValveParams | ConsumerParams | ProviderParams) => void
	updateElement: (element: PipeParams | PumpParams | GateValveParams | SafeValveParams | ConsumerParams | ProviderParams, idx: number) => void
	deleteElement: (idx: number) => void
	deleteAll: () => void
	setIsSelected: (idx: number) => void
}

export interface ResultsActions {
	pushNewData: (newData: UnsteadyChartData) => void
	resetResult: () => void,
	setIter: (a: number) => void
}