import { Cylinder } from '@react-three/drei'
import { FC, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../../../../../../../../lib/globalStore/defaultOrthoElementsConfig'
import { animated } from '@react-spring/three'
import { Mesh } from 'three'
import useMovement from '../../../hooks/useMovement'
import { GraphNode } from '@/utils/graph/GraphNode'

const OrthoGateValve: FC<{ element: GraphNode }> = ({ element }) => {
	const { position, isSelected } = element.ui
	const { radiusBottom, radiusTop, radialSegments, height } = defaultOrthoElementsConfig.consumer
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ position, objectRef })
	return (
		<animated.group ref={objectRef} {...bind() as any} {...spring}>

			<Cylinder args={[radiusBottom, radiusTop, height, radialSegments]} rotation={[0, 0, Math.PI / 2]}>
				{
					<meshStandardMaterial color={isSelected ? defaultOrthoElementsConfig.general.selectedColor : ''} />
				}
			</Cylinder>
			<Cylinder args={[radiusTop, radiusBottom, height, radialSegments]} rotation={[0, 0, Math.PI / 2]}>
				{
					<meshStandardMaterial color={isSelected ? defaultOrthoElementsConfig.general.selectedColor : ''} />
				}
			</Cylinder>
		</animated.group>
	)
}
export default OrthoGateValve