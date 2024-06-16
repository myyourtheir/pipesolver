import { Cylinder } from '@react-three/drei'
import { FC, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../../../../../../../../lib/globalStore/defaultOrthoElementsConfig'
import { animated } from '@react-spring/three'
import { Mesh } from 'three'
import useMovement from '../../../utils/hooks/useMovement'
import { GraphNode } from '@/utils/graph/GraphNode'

const AnimatedCylinder = animated(Cylinder)

const OrthoConsumer: FC<{ element: GraphNode }> = ({ element }) => {
	const { isSelected } = element.ui
	const { radiusBottom, radiusTop, radialSegments, height } = defaultOrthoElementsConfig.consumer
	const { selectedColor, baseColor } = defaultOrthoElementsConfig.general
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ objectRef, currentElement: element })
	return (
		<AnimatedCylinder ref={objectRef} args={[radiusTop, radiusBottom, height, radialSegments]} {...spring} {...bind() as any} rotation={[0, 0, Math.PI / 2]}>
			{
				<meshStandardMaterial color={isSelected ? selectedColor : baseColor} />
			}
		</AnimatedCylinder>
	)
}

export default OrthoConsumer