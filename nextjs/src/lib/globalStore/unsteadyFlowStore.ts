import { create } from 'zustand'
import { UiConfig, UnsteadyInputData } from '../../../types/stateTypes'
import { UnsteadyFlowActions } from '../../../types/actionTypes'
import { produce } from "immer"
import { Graph } from '@/utils/graph/Graph'
import { GraphNode } from '@/utils/graph/GraphNode'
import { defaultOrthoElementsConfig } from './defaultOrthoElementsConfig'
import { set } from 'zod'


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
	addElement(element, newUi) {
		return set(state => {
			const newElement = new GraphNode(element, newUi)
			state.pipeline.addNode(newElement)
			return {
				...state,
				pipeline: state.pipeline,
				lastTouchedElement: newElement
			}
		})
	},
	updateElement(element, idx) {
		return set((state) => {
			const elementNode = state.pipeline.nodes[idx]
			const { children, parents, id, ui } = elementNode
			const newElementNode = new GraphNode(element, ui)
			newElementNode.id = id
			newElementNode.children = children
			newElementNode.parents = parents
			state.pipeline.nodes[idx] = newElementNode

			if (state.openElements.has(elementNode)) {
				state.removeOpenElement(elementNode)
				state.addOpenElement(newElementNode)
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
	addEdge(sourceNode, destinationNode) {
		return set((state) => {
			state.pipeline.addEdge(sourceNode, destinationNode)
			return {
				...state,
				pipeline: state.pipeline
			}
		})
	},
	removeEdge(sourceNode, destinationNode) {
		return set((state) => {
			state.pipeline.deleteEdge(sourceNode, destinationNode)
			return {
				...state,
				pipeline: state.pipeline
			}
		})
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
			state.openElements = new Set()
			return {
				...state,
				pipeline: state.pipeline,
				openElements: state.openElements,
				lastTouchedElement: null
			}
		})
	},
}))