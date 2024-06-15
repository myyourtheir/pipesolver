import { FC, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../../../../../../../../lib/globalStore/defaultOrthoElementsConfig'
import { animated } from '@react-spring/three'
import { Mesh } from 'three'
import useMovement from '../../../hooks/useMovement'
import { UiConfig } from '../../../../../../../../../types/stateTypes'
import { GraphNode } from '@/utils/graph/GraphNode'

const OrthoPump: FC<{ element: GraphNode }> = ({ element }) => {
	const { isSelected } = element.ui
	const { width, height, depth } = defaultOrthoElementsConfig.pump
	const { selectedColor, baseColor } = defaultOrthoElementsConfig.general
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ objectRef, currentElement: element })
	return (
		<animated.mesh ref={objectRef} {...bind() as any} {...spring}>
			{
				<meshStandardMaterial color={isSelected ? selectedColor : baseColor} />
			}
			<boxGeometry args={[width, height, depth]} />
		</animated.mesh>
	)
}

export default OrthoPump