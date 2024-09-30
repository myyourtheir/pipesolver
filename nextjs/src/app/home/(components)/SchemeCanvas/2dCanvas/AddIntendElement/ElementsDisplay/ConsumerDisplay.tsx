import { Cylinder } from '@react-three/drei'
import { animated, AnimatedComponent } from '@react-spring/three'
import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'
import { forwardRef, ReactNode } from 'react'
import { Group, Mesh } from 'three'
import { ThreeEvent } from '@react-three/fiber'

const ConsumerDisplay = forwardRef<Group, { onClick: (e: ThreeEvent<MouseEvent>) => void }>(function ConsumerDisplay({ onClick }, ref) {
	const { radiusBottom, radiusTop, radialSegments, height } = defaultOrthoElementsConfig.consumer
	const { baseColor } = defaultOrthoElementsConfig.general
	return (
		<group ref={ref} onClick={onClick}>
			<Cylinder args={[radiusTop, radiusBottom, height, radialSegments]} rotation={[0, 0, Math.PI / 2]}>
				{
					<meshStandardMaterial color={baseColor} />
				}
			</Cylinder>
		</group>
	)
})

export default ConsumerDisplay