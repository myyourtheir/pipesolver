import { BoundaryParams, CondParams, GateValveParams, PipeParams, PumpParams, SafeValveParams } from './stateTypes'

export type UnsteadyFlowActions = {
	updateCondParams: (prop: keyof CondParams, value: CondParams[keyof CondParams]) => void
	updateBoundaryParams: (side: 'left' | 'right', prop: keyof BoundaryParams, value: BoundaryParams[keyof BoundaryParams]) => void
	addElement: (element: PipeParams | PumpParams | GateValveParams | SafeValveParams) => void
}