import { ElementParamsUnion, ElementParamsUnionWithUI } from '../../../types/stateTypes'
import { GraphNode } from './GraphNode'

type PreparedElementsObjectForRequest = {
	id: string,
	value: ElementParamsUnion,
	children: string[],
	parents: string[]
}

export class Graph {
	nodes: GraphNode[]

	constructor() {
		this.nodes = []
	}

	addNode(node: GraphNode) {
		this.nodes.push(node)
	}

	addEdge(sourceNode: GraphNode, destinationNode: GraphNode) {
		if (sourceNode) {
			sourceNode.addChild(destinationNode)
			destinationNode.addParent(sourceNode)
		}
	}
	deleteNode(idx: number) {
		const selectedNode = this.nodes[idx]
		this.nodes = this.nodes.filter((_, i) => i !== idx)
		selectedNode.children.forEach(childNode => {
			childNode.parents = childNode.parents.filter(parent => parent !== selectedNode)
		})
		selectedNode.parents.forEach(parentNode => {
			parentNode.children = parentNode.children.filter(child => child !== selectedNode)
		})
	}


	private getNodeValueWithoutUiConfig(elementsValue: ElementParamsUnionWithUI): ElementParamsUnion {
		const { uiConfig, ...rest } = elementsValue
		return rest
	}

	toObj() {
		return this.nodes.reduce((acc: Record<string, PreparedElementsObjectForRequest>, node) => {
			acc[node.id] = {
				id: node.id,
				value: this.getNodeValueWithoutUiConfig(node.value),
				children: node.children.map(child => child.id),
				parents: node.parents.map(parent => parent.id)
			}
			return acc
		},
			{})
	}
}


