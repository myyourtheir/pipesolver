import { create } from 'zustand'
import { UiConfig, UnsteadyInputData } from '../../../types/stateTypes'
import { UnsteadyFlowActions } from '../../../types/actionTypes'
import { produce } from "immer"
import { Graph } from '@/utils/graph/Graph'
import { GraphNode } from '@/utils/graph/GraphNode'
import { defaultOrthoElementsConfig } from './defaultOrthoElementsConfig'


export const useUnsteadyInputStore = create<UnsteadyInputData & UnsteadyFlowActions>()((set) => ({
	cond_params: {
		time_to_iter: 200,
		density: 850,
		viscosity: 10
	},
	pipeline: new Graph(),
	lastTouchedElement: null,
	updateCondParams(cond_params) {
		return set((state) => ({
			...state,
			cond_params: { ...state.cond_params, ...cond_params }
		})

		)
	},
	addElement(element) {
		return set(state => {
			const getPosition = (): [number, number, number] => {
				if (!state.lastTouchedElement) {
					return [0, 0, 0]
				} else {
					const { direction: lastDirection, position: lastElementPosition, length } = state.lastTouchedElement.ui
					if (lastDirection[0] === 'x') {
						return [lastElementPosition[0] + length, lastElementPosition[1], lastElementPosition[2]]
					} else {
						return [lastElementPosition[0], lastElementPosition[1] + length, lastElementPosition[2]]
					}
				}
			}
			const newUi: UiConfig = {
				isSelected: false,
				direction: ['x', 'left-to-right'],
				position: getPosition(),
				length: defaultOrthoElementsConfig[element.type].length
			}
			const newElement = new GraphNode(element, newUi)

			state.pipeline.addNode(newElement)
			// state.pipeline.addEdge(sourceNode, newElement)
			return {
				...state,
				pipeline: state.pipeline,
				lastTouchedElement: newElement
			}
		})
	},
	updateElement(element, idx) {
		return set((state: UnsteadyInputData) => {
			const { children, parents, id, ui } = state.pipeline.nodes[idx]
			const newElement = new GraphNode(element, ui)
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
						isSelected: false
					}
				} else {
					elem.ui = {
						...elem.ui,
						isSelected: true
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