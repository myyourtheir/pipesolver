import { ThreeEvent } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import { OthograthicConfig } from '../../OthograthicConfig'
import { useSpring } from '@react-spring/three'
import * as THREE from 'three'
import { MutableRefObject, useContext, useRef, useState } from 'react'
import { CanvasContext, CanvasContextProps } from '../..'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { GraphNode } from '@/utils/graph/GraphNode'
import useOpenElementsCircles from './useOpenElementsCircles'
import findElementWithMinDistanceTo from '../findElementWithMinDistanceTo'

type useMovementProps = {
	objectRef: MutableRefObject<THREE.Mesh>,
	currentElement: GraphNode
}



let planeIntersectPoint = new THREE.Vector3()
const { clingRadius, springConfig } = OthograthicConfig


const useMovement = ({ objectRef, currentElement }: useMovementProps) => {
	const { openElements, setPosition, removeOpenElement, addOpenElement, addEdge, removeEdge } = useUnsteadyInputStore()
	const { setIsDragging, floorPlane } = useContext(CanvasContext) as CanvasContextProps

	const { isCirclesDrawn, drawOpenElementsCircles, eraseOpenElementsCircles } = useOpenElementsCircles({ openElements, currentElement })

	const posRef = useRef(currentElement.ui.position)

	const prevNeighborsRef = useRef(currentElement.getNeighbours())


	const [spring, api] = useSpring(() => ({
		config: springConfig,
		immediate: true,
		position: posRef.current
	}))

	const bind = useDrag<ThreeEvent<MouseEvent>>(({ active, down, offset: [x, y], event, timeStamp }) => {
		event.stopPropagation()
		event.ray.intersectPlane(floorPlane, planeIntersectPoint)

		if (!isCirclesDrawn && down) {
			drawOpenElementsCircles()
		}

		if (down) {
			posRef.current = [planeIntersectPoint.x, planeIntersectPoint.y, 5]
		}
		else {
			const currentElementVector = new THREE.Vector2(posRef.current[0], posRef.current[1])
			const { elementWithMinDistanceTo, itemVectorWithMinDistanceTo } = findElementWithMinDistanceTo({ openElements, currentElement, currentElementVector })

			prevNeighborsRef.current.forEach((neighbor) => {
				removeEdge(neighbor, currentElement)
				addOpenElement(neighbor)
			})
			if (elementWithMinDistanceTo!) {
				if (elementWithMinDistanceTo.ui.direction[0] == 'x') {
					posRef.current = [itemVectorWithMinDistanceTo!.x + elementWithMinDistanceTo.ui.length / 2 + currentElement.ui.length / 2, itemVectorWithMinDistanceTo!.y, 0]
				} else {
					posRef.current = [itemVectorWithMinDistanceTo!.x, itemVectorWithMinDistanceTo!.y + elementWithMinDistanceTo.ui.length / 2 + currentElement.ui.length / 2, 0]
				}
				removeOpenElement(elementWithMinDistanceTo)
				addEdge(elementWithMinDistanceTo, currentElement)
			}
			addOpenElement(currentElement)

			setPosition(currentElement, posRef.current)

			eraseOpenElementsCircles()
		}
		setIsDragging(active)

		api.start({
			position: posRef.current,
		})
	})

	return { spring, bind }
}

export default useMovement