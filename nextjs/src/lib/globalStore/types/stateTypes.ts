export interface UnsteadyBaseParams {
	mode: 'open' | 'close'
	start_time: number
	duration: number
}

export interface CondParams {
	time_to_iter: number
	density: number
	viscosity: number
}

export interface BoundaryParams {
	type: 'speed' | 'pressure'
	value: number
}

export interface PipeParams {
	type: 'pipe'
	length: number
	diameter: number
}

export interface PumpParams extends UnsteadyBaseParams {
	type: 'pump'
	coef_a: number
	coef_b: number
}

export interface GateValveParams extends UnsteadyBaseParams {
	type: 'gate_valve'
	percentage: number
}

export interface SafeValveParams {
	type: 'safe_valve'
	coef_q: number
	max_pressure: number
}

export interface UnsteadyInputData {
	cond_params: CondParams
	pipeline: (PipeParams | PumpParams | GateValveParams | SafeValveParams)[]
	boundary_params: Record<'left' | 'right', BoundaryParams>
}