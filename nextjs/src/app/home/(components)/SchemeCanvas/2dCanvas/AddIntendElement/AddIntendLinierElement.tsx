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

const vec = new THREE.Vector3()

const AddIntendLinierElement = () => {
	const ref = useRef<THREE.Mesh>(null)
	const { elementModeState: { modeElement } } = useSelectedElementModeContext()

	const { addElement, pipeline } = useUnsteadyInputStore()
	const { defaultValues } = useDefaultElementsConfig()

	useFrame(({ pointer, viewport, camera }) => {
		const line = ref.current
		if (line) {

		}
	})

	const handleClick = (e: ThreeEvent<MouseEvent>) => {

	}
	return (
		<PipeDisplay ref={ref} />
	)
}

export default AddIntendLinierElement



