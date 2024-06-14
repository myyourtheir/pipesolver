import { ElementParamsUnion, UiConfig } from '../../../types/stateTypes'

export class GraphNode {
	id: string
	value: ElementParamsUnion
	children: GraphNode[]
	parents: GraphNode[]
	ui: UiConfig

	constructor(value: ElementParamsUnion, ui: UiConfig) {
		this.id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
		this.value = value
		this.children = []
		this.parents = []
		this.ui = ui
	}

	addChild(node: GraphNode) {
		this.children.push(node)
	}
	addParent(node: GraphNode) {
		this.parents.push(node)
	}

	getNeighbours() {
		return [...this.children, ...this.parents]
	}
}