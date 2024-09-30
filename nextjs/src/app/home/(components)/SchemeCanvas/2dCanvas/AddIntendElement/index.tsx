import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { ElementParamsUnion, UiConfig } from '../../../../../../../types/stateTypes'
import ElementsDisplay from './ElementsDisplay'
import { useSelectedElementModeContext } from '@/app/home/(contexts)/useSelectedElementMode'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'
import { useDefaultElementsConfig } from '@/app/home/(contexts)/useDefaultElementsConfig'
import { defaultElementsConfig } from '@/utils/defaultElementsConfig'

const vec = new THREE.Vector3()

const AddIntendElement = () => {
	const ref = useRef<THREE.Group>(null)
	const { elementModeState: { modeElement } } = useSelectedElementModeContext()

	const { addElement, pipeline } = useUnsteadyInputStore()
	const { defaultValues } = useDefaultElementsConfig()

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

	const handleClick = () => {
		if (ref.current && modeElement !== null) {
			const newUi: UiConfig = {
				isSelected: false,
				position: Array.from(ref.current.position) as [number, number, number],
				length: defaultOrthoElementsConfig[modeElement!].length
			}
			const element = defaultValues[modeElement]
			addElement(element, newUi)
		}
	}

	console.log(pipeline.nodes)
	// TODO logic to add element in node
	return (
		<ElementsDisplay onClick={handleClick} elemType={modeElement} ref={ref} />
	)
}

export default AddIntendElement