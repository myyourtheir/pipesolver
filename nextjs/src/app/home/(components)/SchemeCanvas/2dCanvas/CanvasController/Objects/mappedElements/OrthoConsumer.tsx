import { Cylinder } from '@react-three/drei'
import { FC, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../../../../../../../../lib/globalStore/defaultOrthoElementsConfig'
import { animated } from '@react-spring/three'
import { Mesh } from 'three'
import useMovement from '../../../hooks/useMovement'
import { GraphNode } from '@/utils/graph/GraphNode'

const AnimatedCylinder = animated(Cylinder)

const OrthoConsumer: FC<{ element: GraphNode }> = ({ element }) => {
	const { position, isSelected } = element.ui
	const { radiusBottom, radiusTop, radialSegments, height } = defaultOrthoElementsConfig.consumer
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ position, objectRef })
	return (
		<AnimatedCylinder ref={objectRef} args={[radiusTop, radiusBottom, height, radialSegments]} {...spring} {...bind() as any} rotation={[0, 0, Math.PI / 2]}>
			{
				isSelected
					? <meshStandardMaterial color={defaultOrthoElementsConfig.general.selectedColor} />
					: <meshStandardMaterial />
			}
		</AnimatedCylinder>
	)
}

export default OrthoConsumer