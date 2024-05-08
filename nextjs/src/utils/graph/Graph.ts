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

export const gr = new Graph()

const providerNode = new GraphNode({
	type: 'provider',
	'mode': 'pressure',
	'value': 10,
	'uiConfig': {
		'selected': false,
	}
})
gr.addNode(providerNode)
const pumpNode = new GraphNode({ "type": "pump", "coef_a": 310, "coef_b": 0.000008, "mode": "open", "start_time": 0, "duration": 20, "uiConfig": { "selected": false } })
gr.addNode(pumpNode)

gr.addEdge(providerNode, pumpNode)
