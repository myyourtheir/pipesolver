import { Cylinder } from '@react-three/drei'
import { FC, forwardRef } from 'react'
import { animated } from '@react-spring/three'
import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'
import { Group, Mesh } from 'three'
import { ThreeEvent } from '@react-three/fiber'


const ProviderDisplay = forwardRef<Group, { onClick: (e: ThreeEvent<MouseEvent>) => void }>(function ProviderDisplay({ onClick }, ref) {
	const { radiusBottom, radiusTop, radialSegments, height } = defaultOrthoElementsConfig.provider
	const { baseColor } = defaultOrthoElementsConfig.general
	return (
		<group ref={ref} onClick={onClick}>
			<Cylinder args={[radiusTop, radiusBottom, height, radialSegments]} rotation={[0, 0, Math.PI / 2]} >
				{
					<meshStandardMaterial color={baseColor} />
				}
			</Cylinder>
		</group>
	)
})

export default ProviderDisplay