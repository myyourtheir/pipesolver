import { create } from 'zustand'
import { ElementDirection, UiConfig, UnsteadyInputData } from '../../../types/stateTypes'
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
	openElements: new Set,


	updateCondParams(cond_params) {
		return set((state) => ({
			...state,
			cond_params: { ...state.cond_params, ...cond_params }
		})

		)
	},
	addElement(element) {
		return set(state => {
			const getPosition = (): [[number, number, number], ElementDirection] => {
				if (!state.lastTouchedElement) {
					return [[0, 0, 0], ['x', 'left-to-right']]
				} else {
					const { direction: lastDirection, position: lastElementPosition, length } = state.lastTouchedElement.ui
					if (lastDirection[0] === 'x') {
						return [[lastElementPosition[0] + length, lastElementPosition[1], lastElementPosition[2]], lastDirection]
					} else {
						return [[lastElementPosition[0], lastElementPosition[1] + length, lastElementPosition[2]], lastDirection]
					}
				}
			}
			const [newElementPosition, newElementDirection] = getPosition()
			const newUi: UiConfig = {
				isSelected: false,
				direction: newElementDirection,
				position: newElementPosition,
				length: defaultOrthoElementsConfig[element.type].length
			}
			const newElement = new GraphNode(element, newUi)

			state.pipeline.addNode(newElement)

			if (state.lastTouchedElement) {
				state.pipeline.addEdge(state.lastTouchedElement, newElement)
				// state.removeOpenElement(state.lastTouchedElement)
			}
			state.openElements.add(newElement)
			return {
				...state,
				pipeline: state.pipeline,
				lastTouchedElement: newElement,
				openElements: state.openElements
			}
		})
	},
	updateElement(element, idx) {
		return set((state: UnsteadyInputData) => {
			const elementNode = state.pipeline.nodes[idx]
			const { children, parents, id, ui } = elementNode
			const newElementNode = new GraphNode(element, ui)
			newElementNode.id = id
			newElementNode.children = children
			newElementNode.parents = parents
			if (element.type == 'pipe') {
				newElementNode.ui = { ...elementNode.ui, length: element.length / 100 }
			}
			state.pipeline.nodes[idx] = newElementNode

			if (state.openElements.has(elementNode)) {
				state.openElements.delete(elementNode)
				state.openElements.add(newElementNode)
			}
			return {
				...state,
				pipeline: state.pipeline,
				lastTouchedElement: newElementNode,
				openElements: state.openElements
			}
		})
	},
	setIsSelected(idx) {
		return set((state) => {
			state.pipeline.nodes[idx].ui.isSelected = !state.pipeline.nodes[idx].ui.isSelected
			return {
				...state,
				pipeline: state.pipeline
			}
		}
		)
	},
	setPosition(element, position) {
		return set((state) => {
			element.ui.position = position
			return {
				...state,
				pipeline: state.pipeline
			}
		}
		)
	},
	addOpenElement(element) {
		return set((state) => {
			state.openElements.add(element)
			return {
				...state,
				openElements: state.openElements
			}
		}
		)
	},
	removeOpenElement(element) {
		return set((state) => {
			state.openElements.delete(element)
			return {
				...state,
				openElements: state.openElements
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