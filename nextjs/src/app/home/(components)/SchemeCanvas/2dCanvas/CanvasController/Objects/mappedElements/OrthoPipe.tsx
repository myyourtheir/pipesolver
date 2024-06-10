
import { Cylinder } from '@react-three/drei'
import { ElemProps } from './types'
import { FC, useRef } from 'react'

import useMovement from '../../../hooks/useMovement'
import { defaultOrthoElementsConfig } from '../defaultOrthoElementsConfig'
import { Mesh } from 'three'
import { animated } from '@react-spring/three'

const AnimatedCylinder = animated(Cylinder)

const OrthoPipe: FC<ElemProps & { end: [number, number, number] }> = ({ start, end, isSelected }) => {
	const { diameter, radialSegments } = defaultOrthoElementsConfig.pipe
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ position: start, objectRef })
	return (
		<AnimatedCylinder {...bind() as any} ref={objectRef} args={[diameter, diameter, end[0] - start[0], radialSegments]} rotation={[0, 0, Math.PI / 2]}  {...spring}>
			{
				isSelected
					? <meshStandardMaterial color={defaultOrthoElementsConfig.general.selectedColor} />
					: <meshStandardMaterial />
			}
		</AnimatedCylinder>
	)
}

export default OrthoPipe