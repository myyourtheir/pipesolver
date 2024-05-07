import { ElementParamsUnionWithUI } from '../../../types/stateTypes'
import { GraphNode } from './GraphNode'

export class Graph {
	nodes: Record<GraphNode['id'], GraphNode>

	constructor() {
		this.nodes = {}
	}

	addNode(value: ElementParamsUnionWithUI) {
		const node = new GraphNode(value)
		this.nodes[node.id] = node
	}

	addEdge(sourceId: string, destinationId: string) {
		this.nodes[sourceId].addChild(destinationId)
		this.nodes[destinationId].addParent(sourceId)
	}
}