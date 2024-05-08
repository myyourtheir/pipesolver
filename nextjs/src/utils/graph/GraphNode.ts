import { ElementParamsUnionWithUI } from '../../../types/stateTypes'

export class GraphNode {
	id: string
	value: ElementParamsUnionWithUI
	children: GraphNode[]
	parents: GraphNode[]

	constructor(value: ElementParamsUnionWithUI) {
		this.id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
		this.value = value
		this.children = []
		this.parents = []
	}

	addChild(node: GraphNode) {
		this.children.push(node)
	}
	addParent(node: GraphNode) {
		this.parents.push(node)
	}
}