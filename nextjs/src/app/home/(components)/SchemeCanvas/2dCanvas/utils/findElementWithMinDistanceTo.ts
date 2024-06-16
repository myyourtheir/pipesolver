import { GraphNode } from '@/utils/graph/GraphNode'
import * as THREE from 'three'
import { OthograthicConfig } from '../OthograthicConfig'
const { clingRadius } = OthograthicConfig

type FindElementWithMinDistanceToProps = {
	openElements: Set<GraphNode>,
	currentElementVector: THREE.Vector2,
	currentElement: GraphNode
}
const findElementWithMinDistanceTo = ({ openElements, currentElementVector, currentElement }: FindElementWithMinDistanceToProps) => {
	let elementWithMinDistanceTo!: GraphNode
	let itemVectorWithMinDistanceTo!: THREE.Vector2
	let minDistance: number = clingRadius

	openElements.forEach(item => {
		if (item === currentElement) return
		const itemVector = new THREE.Vector2(item.ui.position[0], item.ui.position[1])
		if (itemVector.distanceTo(currentElementVector) <= clingRadius) {
			const newDistance = itemVector.distanceTo(currentElementVector)
			if (newDistance < minDistance) {
				minDistance = newDistance
				itemVectorWithMinDistanceTo = itemVector
				elementWithMinDistanceTo = item
			}
		}
	})
	return { elementWithMinDistanceTo, itemVectorWithMinDistanceTo }
}
export default findElementWithMinDistanceTo