export interface UnsteadyBaseParams {
	mode: 'open' | 'close'
	start_time: number
	duration: number
}
export interface UiConfig {
	uiConfig: {
		selected: boolean
	}
}

export interface CondParams {
	time_to_iter: number
	density: number
	viscosity: number
}

export interface BoundaryParams {
	mode: 'speed' | 'pressure'
	value: number
}

export interface ProviderParams extends BoundaryParams {
	type: 'provider'
}
export interface ConsumerParams extends BoundaryParams {
	type: 'consumer'
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

export type ElementParamsUnion = PipeParams | PumpParams | GateValveParams | SafeValveParams | ConsumerParams | ProviderParams

export type ElementParamsUnionWithUI = (ElementParamsUnion) & UiConfig

export interface UnsteadyInputData {
	cond_params: CondParams
	pipeline: ElementParamsUnionWithUI[]
}

export type ElementsType = PipeParams['type'] | PumpParams['type'] | GateValveParams['type'] | SafeValveParams['type'] | ConsumerParams['type'] | ProviderParams['type']


// Results 

export interface NestedXY {
	x: number,
	y: number,
}

export interface UnsteadyChartData {
	Davleniya: NestedXY[],
	Skorosty: NestedXY[],
	Napory: NestedXY[],
	t: number
}

export interface ResultsData {
	chartData: Array<UnsteadyChartData>,
	iter: number
}