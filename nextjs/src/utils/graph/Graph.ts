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

	parseJSON() {
		return this.nodes.reduce((acc: Record<string, any>, node) => {
			acc[node.id] = {
				id: node.id,
				value: node.value,
				children: node.children.map(child => child.id),
				parents: node.parents.map(parent => parent.id)
			}
			return acc
		},
			{})
	}
}


