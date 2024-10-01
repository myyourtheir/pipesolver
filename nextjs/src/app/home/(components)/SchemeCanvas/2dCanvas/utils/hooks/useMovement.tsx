import { ThreeEvent } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import { OthograthicConfig } from '../../OthograthicConfig'
import { useSpring } from '@react-spring/three'
import * as THREE from 'three'
import { MutableRefObject, useContext, useRef, useState } from 'react'
import { CanvasContext, CanvasContextProps } from '../..'
import { GraphNode } from '@/utils/graph/GraphNode'
import { useSelectedElementModeContext } from '@/app/home/(contexts)/useSelectedElementMode'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'


type useMovementProps = {
	objectRef: MutableRefObject<THREE.Mesh>,
	currentElement: GraphNode
}



let planeIntersectPoint = new THREE.Vector3()
const { springConfig } = OthograthicConfig


const useMovement = ({ objectRef, currentElement }: useMovementProps) => {
	const { setPosition } = useUnsteadyInputStore()
	const { setIsDragging, floorPlane } = useContext(CanvasContext) as CanvasContextProps
	const posRef = useRef(currentElement.ui.position)
	const { elementModeState: { mode } } = useSelectedElementModeContext()
	const [spring, api] = useSpring(() => ({
		config: springConfig,
		immediate: true,
		position: posRef.current
	}))
	const bind = useDrag<ThreeEvent<MouseEvent>>(({ active, down, offset: [x, y], event, timeStamp }) => {
		if (mode === 'default') {
			event.stopPropagation()
			event.ray.intersectPlane(floorPlane, planeIntersectPoint)
			if (!event.ctrlKey) {
				if (down) {
					posRef.current = [planeIntersectPoint.x, planeIntersectPoint.y, 1]
				} else {
					setPosition(currentElement, posRef.current)
				}
				setIsDragging(active)
				api.start({
					position: posRef.current,
				})
			}
		}
	})

	return { spring, bind }
}

export default useMovement