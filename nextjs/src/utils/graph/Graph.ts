import { elements } from 'chart.js'
import { ElementParamsUnion, JsonGraphNode, UiConfig } from '../../../types/stateTypes'
import { GraphNode } from './GraphNode'


export class Graph {
	nodes: GraphNode[]

	constructor(nodes: GraphNode[] = []) {
		this.nodes = nodes
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
	deleteEdge(sourceNode: GraphNode, destinationNode: GraphNode) {
		sourceNode.removeChild(destinationNode)
		sourceNode.removeParent(destinationNode)
		destinationNode.removeChild(sourceNode)
		destinationNode.removeParent(sourceNode)
	}
	deleteNode(idx: number) {
		const selectedNode = this.nodes[idx]
		this.nodes = this.nodes.filter((_, i) => i !== idx)
		if (selectedNode.value.type === 'pipe') {
			const { pipeNeighbours } = selectedNode.ui
			if (pipeNeighbours) {
				Object.keys(pipeNeighbours).forEach(id => {
					const neighbour = this.nodes.find(node => node.id === id)
					neighbour?.ui.openPoints.push(pipeNeighbours[id])
				})
			}
		}
		selectedNode.children.forEach(childNode => {
			if (childNode.value.type === 'pipe') {
				const pipeIdx = this.nodes.findIndex(node => node === childNode)
				this.deleteNode(pipeIdx)
			}
			childNode.parents = childNode.parents.filter(parent => parent !== selectedNode)
		})

		selectedNode.parents.forEach(parentNode => {
			if (parentNode.value.type === 'pipe') {
				const pipeIdx = this.nodes.findIndex(node => node === parentNode)
				this.deleteNode(pipeIdx)
			}
			parentNode.children = parentNode.children.filter(child => child !== selectedNode)
		})
	}



	toObj() {
		return this.nodes.reduce((acc: Record<string, JsonGraphNode>, node) => {
			acc[node.id] = {
				id: node.id,
				name: node.name,
				value: node.value,
				children: node.children.map(child => child.id),
				parents: node.parents.map(parent => parent.id),
				ui: node.ui
			}
			return acc
		},
			{})
	}
}


