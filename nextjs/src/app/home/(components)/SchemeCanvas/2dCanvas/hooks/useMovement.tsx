import { Events, ThreeEvent } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import { OthograthicConfig } from '../OthograthicConfig'
import { useSpring } from '@react-spring/three'
import * as THREE from 'three'
import { MutableRefObject, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { CanvasContext, CanvasContextProps } from '..'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { GraphNode } from '@/utils/graph/GraphNode'

type useMovementProps = {
	objectRef: MutableRefObject<THREE.Mesh>,
	currentElement: GraphNode
}

let planeIntersectPoint = new THREE.Vector3()


const useMovement = ({ objectRef, currentElement }: useMovementProps) => {
	const { openElements, setPosition, removeOpenElement, addOpenElement } = useUnsteadyInputStore()
	const { isDragging, setIsDragging, floorPlane } = useContext(CanvasContext) as CanvasContextProps
	const [isPointerDown, setIsPointerDown] = useState(false)
	const posRef = useRef(currentElement.ui.position)


	const { clingRadius, springConfig } = OthograthicConfig
	const [spring, api] = useSpring(() => ({
		config: springConfig,
		immediate: true,
		position: posRef.current
	}))

	const bind = useDrag<ThreeEvent<MouseEvent>>(({ active, down, offset: [x, y], event, timeStamp }) => {
		// Получаем размеры перетаскиваемого объекта
		// let mea = new THREE.Vector3()
		// let box = new THREE.Box3().setFromObject(objectRef.current)
		// let dimensions = box.getSize(mea)
		event.stopPropagation()//TODO Элементы не притягиваются, нужно исправить тут
		event.ray.intersectPlane(floorPlane, planeIntersectPoint)
		if (down) {
			posRef.current = [planeIntersectPoint.x, planeIntersectPoint.y, 5]
		}
		else {
			let elementWithMinDistanceTo: GraphNode
			let itemVectorWithMinDistanceTo: THREE.Vector2
			let minDistance: number = clingRadius
			const currentElementVector = new THREE.Vector2(posRef.current[0], posRef.current[1])
			// ///////////////////////////////////////////////// to find min distance and nessecary vector
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
			// ////////////////////////////////////////////////////////////////////////////
			if (elementWithMinDistanceTo!) {
				if (elementWithMinDistanceTo.ui.direction[0] == 'x') {
					posRef.current = [itemVectorWithMinDistanceTo!.x + elementWithMinDistanceTo.ui.length / 2, itemVectorWithMinDistanceTo!.y, 0]
				} else {
					posRef.current = [itemVectorWithMinDistanceTo!.x, itemVectorWithMinDistanceTo!.y + elementWithMinDistanceTo.ui.length / 2, 0]
				}
			}
			setPosition(currentElement, posRef.current)
		}
		setIsDragging(active)

		api.start({
			position: posRef.current,
		})
		return timeStamp
	})

	return { spring, bind }
}

export default useMovement