import { create } from 'zustand'
import { UiConfig, UnsteadyInputData } from '../../../types/stateTypes'
import { UnsteadyFlowActions } from '../../../types/actionTypes'
import { produce } from "immer"
import { Graph } from '@/utils/graph/Graph'
import { GraphNode } from '@/utils/graph/GraphNode'

const defaultUiConfig: UiConfig = {
	selected: false
}
export const useUnsteadyInputStore = create<UnsteadyInputData & UnsteadyFlowActions>()((set) => ({
	cond_params: {
		time_to_iter: 200,
		density: 850,
		viscosity: 10
	},
	pipeline: new Graph(),
	updateCondParams(cond_params) {
		return set((state) => ({
			...state,
			cond_params: { ...state.cond_params, ...cond_params }
		})

		)
	},
	addElement(element, sourceNode) {

		const newElement = new GraphNode(element, defaultUiConfig)
		return set(state => {

			state.pipeline.addNode(newElement)
			state.pipeline.addEdge(sourceNode, newElement)
			return {
				...state,
				pipeline: state.pipeline
			}
		})
	},
	updateElement(element, idx) {
		return set((state: UnsteadyInputData) => {
			const { children, parents, id } = state.pipeline.nodes[idx]
			const newElement = new GraphNode(element, defaultUiConfig)
			newElement.id = id
			newElement.children = children
			newElement.parents = parents
			state.pipeline.nodes[idx] = newElement
			return {
				...state,
				pipeline: state.pipeline
			}
		})
	},
	setIsSelected(idx) {
		return set((state) => {
			state.pipeline.nodes.forEach((elem, i) => {
				if (i !== idx) {
					elem.ui = {
						...elem.ui,
						selected: false
					}
				} else {
					elem.ui = {
						...elem.ui,
						selected: true
					}
				}
			})
			return {
				...state,
				pipeline: state.pipeline
			}
		}
		)
	},
	deleteElement(idx) {
		return set((state) => {
			state.pipeline.deleteNode(idx)
			return {
				...state,
				pipeline: state.pipeline
			}
		})
	},
	deleteAll() {
		return set((state) => {
			state.pipeline = new Graph()
			return {
				...state,
				pipeline: state.pipeline
			}
		})
	},
}))