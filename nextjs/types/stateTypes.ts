import { Graph } from '@/utils/graph/Graph'
import { GraphNode } from '@/utils/graph/GraphNode'
import { start } from 'repl'
import { z } from 'zod'

const zUnsteadyBaseParams = z.object({
	mode: z.union([z.literal('open'), z.literal('close')]),
	start_time: z.number(),
	duration: z.number(),
})

// export interface UnsteadyBaseParams {
// 	mode: 'open' | 'close'
// 	start_time: number
// 	duration: number
// }
export type UnsteadyBaseParams = z.infer<typeof zUnsteadyBaseParams>
const zSides = z.union([z.literal('left'), z.literal('right'), z.literal('top'), z.literal('bottom')])
// export type Sides = 'left' | 'right' | 'top' | 'bottom'
export type Sides = z.infer<typeof zSides>

export const zUiConfig = z.object({
	isSelected: z.boolean(),
	position: z.tuple([z.number(), z.number(), z.number()]),
	length: z.number(),
	openPoints: z.array(zSides),
	pipeNeighbours: z.record(z.string(), zSides).optional()
})

export type UiConfig = z.infer<typeof zUiConfig>
// export interface UiConfig {
// 	isSelected: boolean
// 	position: [number, number, number]
// 	length: number,
// 	openPoints: Sides[],
// 	pipeNeighbours?: Record<string, Sides>
// }

export const zCondParams = z.object({
	time_to_iter: z.number(),
	density: z.number(),
	viscosity: z.number()
})

export type CondParams = z.infer<typeof zCondParams>
// export interface CondParams {
// 	time_to_iter: number
// 	density: number
// 	viscosity: number
// }


const zBoundaryParams = z.object({
	mode: z.union([z.literal('pressure'), z.literal('speed')]),
	value: z.number()
})

// export interface BoundaryParams {
// 	mode: 'speed' | 'pressure'
// 	value: number
// }
export type BoundaryParams = z.infer<typeof zBoundaryParams>

const zProviderParams = zBoundaryParams.extend({
	type: z.literal('provider')
}
)

// export interface ProviderParams extends BoundaryParams {
// 	type: 'provider'
// }
export type ProviderParams = z.infer<typeof zProviderParams>
const zConsumerParams = zBoundaryParams.extend({
	type: z.literal('consumer')
})
export type ConsumerParams = z.infer<typeof zConsumerParams>
// export interface ConsumerParams extends BoundaryParams {
// 	type: 'consumer'
// }


const zPipeParams = z.object({
	type: z.literal('pipe'),
	length: z.number(),
	diameter: z.number()
})
export type PipeParams = z.infer<typeof zPipeParams>
// export interface PipeParams {
// 	type: 'pipe'
// 	length: number
// 	diameter: number
// }
const zPumpParams = zUnsteadyBaseParams.extend({
	type: z.literal('pump'),
	coef_a: z.number(),
	coef_b: z.number()
})
export type PumpParams = z.infer<typeof zPumpParams>
// export interface PumpParams extends UnsteadyBaseParams {
// 	type: 'pump'
// 	coef_a: number
// 	coef_b: number
// }
const zGateValveParams = zUnsteadyBaseParams.extend({
	type: z.literal('gate_valve'),
	percentage: z.number(),
})
export type GateValveParams = z.infer<typeof zGateValveParams>

// export interface GateValveParams extends UnsteadyBaseParams {
// 	type: 'gate_valve'
// 	percentage: number
// }
const zSafeValveParams = z.object({
	type: z.literal('safe_valve'),
	coef_q: z.number(),
	max_pressure: z.number()
})
export type SafeValveParams = z.infer<typeof zSafeValveParams>
// export interface SafeValveParams {
// 	type: 'safe_valve'
// 	coef_q: number
// 	max_pressure: number
// }


const zTeeParams = z.object({
	type: z.literal('tee')
})
export type TeeParams = z.infer<typeof zTeeParams>
// export type TeeParams = {
// 	type: 'tee'
// }

export const zElementParamsUnion = z.union([zPipeParams, zPumpParams, zGateValveParams, zSafeValveParams, zConsumerParams, zProviderParams, zTeeParams])

export type ElementParamsUnion = z.infer<typeof zElementParamsUnion>
// export type ElementParamsUnion = PipeParams | PumpParams | GateValveParams | SafeValveParams | ConsumerParams | ProviderParams | TeeParams

export interface UnsteadyInputData {
	cond_params: CondParams
	pipeline: Graph,
}

export type ElementsType = ElementParamsUnion['type']


// Results 

export interface OneSectionResponse {
	x: number,
	p: number,
	V: number,
	H: number,
}
export interface ResponseElement {
	id: string
	type: string
	value: Array<OneSectionResponse>
	children: Array<string>
	parents: Array<string>
}
export interface ResultMomentData {
	moment_result: Record<string, ResponseElement>
	t: number
}

export interface ResultsData {
	chartData: Array<ResultMomentData>,
	iter: number
}


export type BlockDisplayStoreState = {
	conditionsBarDisplay: boolean,
	elementsBarDisplay: boolean,
	elementsTreeDisplay: boolean,
	resultChartDisplay: boolean,
}

export const zJsonGraphNode = z.object({
	id: z.string(),
	name: z.string(),
	value: zElementParamsUnion,
	children: z.array(z.string()),
	parents: z.array(z.string()),
	ui: zUiConfig
})
export type JsonGraphNode = z.infer<typeof zJsonGraphNode>