import { ThreeEvent } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import { OthograthicConfig } from '../OthograthicConfig'
import { useSpring } from '@react-spring/three'
import * as THREE from 'three'
import { MutableRefObject, useContext, useRef } from 'react'
import { CanvasContext, CanvasContextProps } from '..'

type useMovementProps = {
	position: [number, number, number],
	objectRef: MutableRefObject<THREE.Mesh>
}

const useMovement = ({ position, objectRef }: useMovementProps) => {
	const { setIsDragging, floorPlane, openPoints } = useContext(CanvasContext) as CanvasContextProps
	const posRef = useRef(position)
	let planeIntersectPoint = new THREE.Vector3()
	const { clingRadius, springConfig } = OthograthicConfig
	const [spring, api] = useSpring(() => ({
		position: posRef.current,
		config: springConfig,
		immediate: true,
	}))




	const bind = useDrag<ThreeEvent<MouseEvent>>(({ active, offset: [x, y], event, timeStamp }) => {
		// Получаем размеры перетаскиваемого объекта

		let mea = new THREE.Vector3()
		let box = new THREE.Box3().setFromObject(objectRef.current)
		let dimensions = box.getSize(mea)

		event.stopPropagation()
		if (active) {
			event.ray.intersectPlane(floorPlane, planeIntersectPoint)
			posRef.current = [planeIntersectPoint.x, planeIntersectPoint.y, 0]
		}
		setIsDragging(active)
		// posRef.current = [x / camera.zoom, - y / camera.zoom, 0]
		const currentElementVector = new THREE.Vector3(...posRef.current)
		const newPos = openPoints.reduce<[number, number, number]>((acc, item) => {
			const itemVector = new THREE.Vector3(item[0], item[1], 0)
			if (itemVector.distanceTo(currentElementVector) <= clingRadius) {
				posRef.current = [itemVector.x + dimensions.x / 2, itemVector.y, itemVector.z]
			}
			return acc
		}, posRef.current)

		// api.start({
		// 	position: posRef.current,
		// })

		api.start({
			position: newPos,
		})

		return timeStamp
	})
	return { spring, bind }
}

export default useMovement