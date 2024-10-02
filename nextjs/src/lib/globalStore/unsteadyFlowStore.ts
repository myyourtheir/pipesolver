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
	addPipe(element, newUi, sourceNode, destinationNode) {
		return set(state => {
			const newElement = new GraphNode(element, newUi)
			state.pipeline.addNode(newElement)
			state.pipeline.addEdge(sourceNode, newElement)
			state.pipeline.addEdge(newElement, destinationNode)
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
			return {
				...state,
				pipeline: state.pipeline,
				lastTouchedElement: newElementNode,

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
				pipeline: state.pipeline,
				lastTouchedElement: null
			}
		})
	},
	removeOpenSide(element, side) {
		return set((state) => {
			element.ui.openPoints = element.ui.openPoints.filter(s => s !== side)
			return {
				...state,
				pipeline: state.pipeline
			}
		}
		)
	},
}))