import { FC, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../../../../../../../../lib/globalStore/defaultOrthoElementsConfig'
import { animated } from '@react-spring/three'
import { Mesh } from 'three'
import useMovement from '../../../hooks/useMovement'
import { UiConfig } from '../../../../../../../../../types/stateTypes'
import { GraphNode } from '@/utils/graph/GraphNode'

const OrthoPump: FC<{ element: GraphNode }> = ({ element }) => {
	const { position, isSelected } = element.ui
	const { width, height, depth } = defaultOrthoElementsConfig.pump
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ position, objectRef })
	return (
		<animated.mesh ref={objectRef} {...bind() as any} {...spring}>
			{
				<meshStandardMaterial color={isSelected ? defaultOrthoElementsConfig.general.selectedColor : ''} />
			}
			<boxGeometry args={[width, height, depth]} />
		</animated.mesh>
	)
}

export default OrthoPump