import { ElementParamsUnion, Sides } from '../../../../../../../../../types/stateTypes'
import { elementsDefaultOpenPoints } from '../../../AddIntendElement/AddIntendNonLinierElement'


type ElementLinksPointPositionT<T extends keyof typeof elementsDefaultOpenPoints> = {
	[K in T]: {
		[P in typeof elementsDefaultOpenPoints[K][number]]: [number, number, number]
	}
}
export const ElementLinksPointPosition:
	ElementLinksPointPositionT<Exclude<ElementParamsUnion['type'], 'pipe'>> = {
	pump: {
		left: [-0.35, 0, 2],
		right: [0.35, 0, 2],
	},
	consumer: {
		left: [-0.35, 0, 2],
	},
	gate_valve: {
		left: [-0.35, 0, 2],
		right: [0.35, 0, 2],
	},
	safe_valve: {
		left: [-0.35, 0, 2],
		right: [0.35, 0, 2],
	},
	provider: {
		right: [0.35, 0, 2]
	}
}


