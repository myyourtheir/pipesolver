import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'
import ElementsDisplay from './ElementsDisplay'
import { UiConfig } from '../../../../../../../types/stateTypes'
import { ThreeEvent, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useSelectedElementModeContext } from '@/app/home/(contexts)/useSelectedElementMode'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { useDefaultElementsConfig } from '@/app/home/(contexts)/useDefaultElementsConfig'
const AddIntendNonLinierElement = () => {
	const ref = useRef<THREE.Group>(null)
	const { elementModeState: { modeElement } } = useSelectedElementModeContext()

	const { addElement, pipeline } = useUnsteadyInputStore()
	const { defaultValues } = useDefaultElementsConfig()

	useFrame(({ pointer, viewport, camera }) => {
		if (ref.current) {
			ref.current.position.set(
				((pointer.x * viewport.width / camera.zoom * 50) / 2 + camera.position.x),
				((pointer.y * viewport.height) / camera.zoom * 50 / 2 + camera.position.y),
				2
			)
		}
	})

	const handleClick = (e: ThreeEvent<MouseEvent>) => {
		e.stopPropagation()
		if (ref.current && modeElement !== null && !e.ctrlKey) {
			const newUi: UiConfig = {
				isSelected: false,
				position: Array.from(ref.current.position) as [number, number, number],
				length: defaultOrthoElementsConfig[modeElement!].length
			}
			const element = defaultValues[modeElement]
			addElement(element, newUi)
		}
	}
	return (
		<ElementsDisplay onClick={handleClick} elemType={modeElement} ref={ref} />
	)
}

export default AddIntendNonLinierElement