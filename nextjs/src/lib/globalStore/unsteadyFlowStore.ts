import { create } from 'zustand'
import { UiConfig, UnsteadyInputData } from '../../../types/stateTypes'
import { UnsteadyFlowActions } from '../../../types/actionTypes'
import { produce } from "immer"

const defaultUiConfig: UiConfig = {
	uiConfig: {
		selected: false
	}
}
export const useUnsteadyInputStore = create<UnsteadyInputData & UnsteadyFlowActions>()((set) => ({
	cond_params: {
		time_to_iter: 500,
		density: 850,
		viscosity: 10
	},
	pipeline: [],
	updateCondParams(prop, value) {
		return set(produce((state: UnsteadyInputData) => {
			state.cond_params[prop] = value
		}))
	},
	addElement(element) {
		const elementWithUiConfig = { ...element, ...defaultUiConfig }
		return set(state => ({
			pipeline: [...state.pipeline, elementWithUiConfig]
		}))
	},
	setIsSelected(idx) {
		return set(produce((state: UnsteadyInputData) => {
			state.pipeline.forEach((elem, i) => {
				if (i !== idx) {
					elem.uiConfig.selected = false
				} else {
					elem.uiConfig.selected = true
				}
			})
		}))
	},
	deleteElement(idx) {
		return set(state => ({
			pipeline: state.pipeline.filter((_, i) => i !== idx
			)
		}))
	},
	deleteAll() {
		return set(state => ({
			pipeline: []
		}))
	}

}))