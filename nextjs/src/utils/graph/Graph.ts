import { ElementParamsUnionWithUI } from '../../../types/stateTypes'
import { GraphNode } from './GraphNode'

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
}


