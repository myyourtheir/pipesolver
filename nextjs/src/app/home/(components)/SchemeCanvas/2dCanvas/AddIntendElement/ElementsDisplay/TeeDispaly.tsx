import { Cylinder } from '@react-three/drei'
import { FC, forwardRef } from 'react'
import { animated } from '@react-spring/three'
import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'
import { Group, Mesh } from 'three'
import { ThreeEvent } from '@react-three/fiber'


const TeeDisplay = forwardRef<Group, { onClick: (e: ThreeEvent<MouseEvent>) => void }>(function TeeDisplay({ onClick }, ref) {
	const { height, width, depth } = defaultOrthoElementsConfig.tee
	const { baseColor } = defaultOrthoElementsConfig.general

	const secHeight = height / 5 * 4
	const secWidth = width / 3
	const secDepth = depth / 2
	return (
		<group ref={ref} onClick={onClick}>
			<mesh >
				<meshStandardMaterial color={baseColor} opacity={0.5} transparent />
				<boxGeometry args={[width, height, depth]} />
			</mesh>
			<mesh position={[0, secWidth / 2 + height / 2, 2]} rotation={[0, 0, Math.PI / 2]}>
				<meshStandardMaterial color={baseColor} opacity={0.5} transparent />
				<boxGeometry args={[secWidth, secHeight, secDepth]} />
			</mesh>
		</group>
	)
})

export default TeeDisplay