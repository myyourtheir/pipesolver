import { ThreeEvent, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { ModeState, useSelectedElementModeContext } from '@/app/home/(contexts)/useSelectedElementMode'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'
import { useDefaultElementsConfig } from '@/app/home/(contexts)/useDefaultElementsConfig'
import PipeDisplay from './ElementsDisplay/PipeDisplay'
import { UiConfig } from '../../../../../../../types/stateTypes'
import { Line, LineProps } from '@react-three/drei'
import { usePipeElementContext } from '@/app/home/(contexts)/useNewPipeElementContext'

const vec = new THREE.Vector3()

const AddIntendLinierElement = () => {
	const ref = useRef<THREE.Line>(null)
	const { addElement, pipeline } = useUnsteadyInputStore()
	const { defaultValues } = useDefaultElementsConfig()
	const { state: { isActive, parentElement } } = usePipeElementContext()
	useFrame(({ pointer, viewport, camera }) => {
		const line = ref.current
		if (line) {
			if (isActive && parentElement) {
				const [fx, fy, fz] = parentElement.ui.position
				const firstPoint = new THREE.Vector3(fx, fy, fz)
				const secondPoint = new THREE.Vector3(
					(pointer.x * viewport.width / camera.zoom * 50) / 2 + camera.position.x,
					(pointer.y * viewport.height) / camera.zoom * 50 / 2 + camera.position.y,
					2
				)
				line.geometry.setFromPoints([firstPoint, secondPoint])
			}
		}
	})

	return (
		<>
			{
				parentElement &&
				<PipeDisplay ref={ref} />
			}
		</>
	)
}

export default AddIntendLinierElement



