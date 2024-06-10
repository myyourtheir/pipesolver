import { FC, useRef } from 'react'
import { ElemProps } from './types'
import { defaultOrthoElementsConfig } from '../defaultOrthoElementsConfig'
import { animated } from '@react-spring/three'
import { Mesh } from 'three'
import useMovement from '../../../hooks/useMovement'

const OrthoPump: FC<ElemProps> = ({ start, isSelected }) => {
	const { width, height, depth } = defaultOrthoElementsConfig.pump
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ position: start, objectRef })
	return (
		<animated.mesh ref={objectRef} {...bind() as any} {...spring}>
			{
				isSelected
					? <meshStandardMaterial color={defaultOrthoElementsConfig.general.selectedColor} />
					: <meshStandardMaterial />
			}
			<boxGeometry args={[width, height, depth]} />
		</animated.mesh>
	)
}

export default OrthoPump