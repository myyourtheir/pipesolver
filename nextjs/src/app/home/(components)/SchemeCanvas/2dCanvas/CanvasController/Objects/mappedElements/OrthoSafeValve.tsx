import { Cylinder, Sphere } from '@react-three/drei'
import { ElemProps } from './types'
import { FC, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../defaultOrthoElementsConfig'
import { animated } from '@react-spring/three'
import { Mesh } from 'three'
import useMovement from '../../../hooks/useMovement'


const AnimatedSphere = animated(Sphere)

const OrthoSafeValve: FC<ElemProps> = ({ start, isSelected }) => {
	const { radius, segments, boxDepth, boxHeight, boxWidth } = defaultOrthoElementsConfig.safeValve
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ position: start, objectRef })


	return (
		<group  {...bind() as any}>
			<AnimatedSphere ref={objectRef} args={[radius, segments, segments]} {...spring}>
				{
					isSelected
						? <meshStandardMaterial color={defaultOrthoElementsConfig.general.selectedColor} />
						: <meshStandardMaterial />
				}
			</AnimatedSphere>
		</group>

	)
}
export default OrthoSafeValve