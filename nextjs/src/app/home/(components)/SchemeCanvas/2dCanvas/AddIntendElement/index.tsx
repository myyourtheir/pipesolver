import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { ElementParamsUnion } from '../../../../../../../types/stateTypes'
import ElementsDisplay from './ElementsDisplay'
import { useSelectedElementModeContext } from '@/app/home/(contexts)/useSelectedElementMode'


const AddIntendElement = () => {
	const vec = new THREE.Vector3()
	const ref = useRef<THREE.Group>(null)
	const { elementModeState: { modeElement } } = useSelectedElementModeContext()
	useFrame(({ pointer, viewport, camera }) => {
		if (ref.current) {
			ref.current.position.set(
				((pointer.x * viewport.width / camera.zoom * 50) / 2 + camera.position.x),
				((pointer.y * viewport.height) / camera.zoom * 50 / 2 + camera.position.y),
				1
			)
			ref.current.getWorldPosition(vec)
		}
	})
	return (
		<ElementsDisplay elemType={modeElement} ref={ref} />
	)
}

export default AddIntendElement