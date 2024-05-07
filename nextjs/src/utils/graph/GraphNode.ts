import { ElementParamsUnionWithUI } from '../../../types/stateTypes'

export class GraphNode {
	id: string
	value: ElementParamsUnionWithUI
	children: string[]
	parents: string[]

	constructor(value: ElementParamsUnionWithUI) {
		this.id = new Date().getTime().toString()
		this.value = value
		this.children = []
		this.parents = []
	}

	addChild(nodeId: string) {
		this.children.push(nodeId)
	}
	addParent(nodeId: string) {
		this.parents.push(nodeId)
	}
}