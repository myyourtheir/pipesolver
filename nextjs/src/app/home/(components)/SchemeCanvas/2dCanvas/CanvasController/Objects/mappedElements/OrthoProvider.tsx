import { Cylinder } from '@react-three/drei'
import { ElemProps } from './types'
import { FC, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../defaultOrthoElementsConfig'
import { Mesh } from 'three'
import { animated } from '@react-spring/three'
import useMovement from '../../../hooks/useMovement'


const AnimatedCylinder = animated(Cylinder)

const OrthoProvider: FC<ElemProps> = ({ start, isSelected }) => {
	const { radiusBottom, radiusTop, radialSegments, height } = defaultOrthoElementsConfig.provider
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ position: start, objectRef })
	return (
		<AnimatedCylinder ref={objectRef} args={[radiusTop, radiusBottom, height, radialSegments]} {...bind() as any} rotation={[0, 0, Math.PI / 2]}  {...spring}>
			{
				isSelected
					? <meshStandardMaterial color={defaultOrthoElementsConfig.general.selectedColor} />
					: <meshStandardMaterial />
			}
		</AnimatedCylinder>
	)
}

export default OrthoProvider