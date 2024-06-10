import { Cylinder } from '@react-three/drei'
import { ElemProps } from './types'
import { FC, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../defaultOrthoElementsConfig'
import { animated } from '@react-spring/three'
import { Mesh } from 'three'
import useMovement from '../../../hooks/useMovement'

const OrthoGateValve: FC<ElemProps> = ({ start, isSelected }) => {
	const { radiusBottom, radiusTop, radialSegments, height } = defaultOrthoElementsConfig.consumer
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ position: start, objectRef })
	return (
		<animated.group ref={objectRef} {...bind() as any} {...spring}>

			<Cylinder args={[radiusBottom, radiusTop, height, radialSegments]} rotation={[0, 0, Math.PI / 2]}>
				{
					isSelected
						? <meshStandardMaterial color={defaultOrthoElementsConfig.general.selectedColor} />
						: <meshStandardMaterial />
				}
			</Cylinder>
			<Cylinder args={[radiusTop, radiusBottom, height, radialSegments]} rotation={[0, 0, Math.PI / 2]}>
				{
					isSelected
						? <meshStandardMaterial color={defaultOrthoElementsConfig.general.selectedColor} />
						: <meshStandardMaterial />
				}
			</Cylinder>
		</animated.group>
	)
}
export default OrthoGateValve