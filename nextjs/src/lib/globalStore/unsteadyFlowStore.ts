import { create } from 'zustand'
import { UnsteadyInputData } from './types/stateTypes'
import { UnsteadyFlowActions } from './types/actionTypes'
import { produce } from "immer"


export const useUnsteadyInputStore = create<UnsteadyInputData & UnsteadyFlowActions>()((set) => ({
	cond_params: {
		time_to_iter: 500,
		density: 850,
		viscosity: 10
	},
	pipeline: [],
	boundary_params: {
		left: {
			type: 'pressure',
			value: 0
		},
		right: {
			type: 'pressure',
			value: 0
		}
	},
	updateCondParams(prop, value) {
		return set(produce((state: UnsteadyInputData) => {
			state.cond_params[prop] = value
		}))
	},
	updateBoundaryParams(side, prop, value) {
		// return set(produce((state: UnsteadyInputData) => {
		// 	state.boundary_params[side][prop] = value
		// }))
		return set((state) => ({
			boundary_params: {
				...state.boundary_params,
				[side]: {
					...state.boundary_params[side],
					[prop]: value
				}
			}
		}))
	},
	addElement(element) {
		return set(state => ({
			pipeline: [...state.pipeline, element]
		}))
	},
}))