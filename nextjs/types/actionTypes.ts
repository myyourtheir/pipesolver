import { BoundaryParams, CondParams, ConsumerParams, GateValveParams, PipeParams, ProviderParmas, PumpParams, SafeValveParams } from './stateTypes'

export interface UnsteadyFlowActions {
	updateCondParams: (prop: keyof CondParams, value: CondParams[keyof CondParams]) => void
	addElement: (element: PipeParams | PumpParams | GateValveParams | SafeValveParams | ConsumerParams | ProviderParmas) => void
	deleteElement: (idx: number) => void
	deleteAll: () => void
	setIsSelected: (idx: number) => void
}
