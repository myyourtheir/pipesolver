import { Cylinder, Sphere } from '@react-three/drei'
import { FC, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../../../../../../../../lib/globalStore/defaultOrthoElementsConfig'
import { animated } from '@react-spring/three'
import { Mesh } from 'three'
import useMovement from '../../../hooks/useMovement'
import { GraphNode } from '@/utils/graph/GraphNode'


const AnimatedSphere = animated(Sphere)

const OrthoSafeValve: FC<{ element: GraphNode }> = ({ element }) => {
	const { position, isSelected } = element.ui
	const { radius, segments, boxDepth, boxHeight, boxWidth } = defaultOrthoElementsConfig.safe_valve
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ position, objectRef })


	return (
		<group  {...bind() as any}>
			<AnimatedSphere ref={objectRef} args={[radius, segments, segments]} {...spring}>
				{
					<meshStandardMaterial color={isSelected ? defaultOrthoElementsConfig.general.selectedColor : ''} />
				}
			</AnimatedSphere>
		</group>

	)
}
export default OrthoSafeValve