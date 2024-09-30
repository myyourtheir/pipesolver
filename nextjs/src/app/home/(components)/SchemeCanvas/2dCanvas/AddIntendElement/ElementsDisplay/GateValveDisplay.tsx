import { Cylinder } from '@react-three/drei'
import { FC, forwardRef, useRef } from 'react'
import { animated } from '@react-spring/three'
import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'
import { Group } from 'three'
import { ThreeEvent } from '@react-three/fiber'


const GateValveDisplay = forwardRef<Group, { onClick: (e: ThreeEvent<MouseEvent>) => void }>(function GateValveDisplay({ onClick }, ref) {
	const { radiusBottom, radiusTop, radialSegments, height } = defaultOrthoElementsConfig.consumer
	const { baseColor } = defaultOrthoElementsConfig.general
	return (
		<animated.group ref={ref} onClick={onClick} >

			<Cylinder args={[radiusBottom, radiusTop, height, radialSegments]} rotation={[0, 0, Math.PI / 2]}>
				{
					<meshStandardMaterial color={baseColor} opacity={0.5} transparent />
				}
			</Cylinder>
			<Cylinder args={[radiusTop, radiusBottom, height, radialSegments]} rotation={[0, 0, Math.PI / 2]}>
				{
					<meshStandardMaterial color={baseColor} opacity={0.5} transparent />
				}
			</Cylinder>
		</animated.group>
	)
})
export default GateValveDisplay