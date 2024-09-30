import { Sphere } from '@react-three/drei'
import { animated } from '@react-spring/three'
import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'
import { forwardRef } from 'react'
import { Group } from 'three'
import { ThreeEvent } from '@react-three/fiber'


const AnimatedSphere = animated(Sphere)

const SafeValveDisplay = forwardRef<Group, { onClick: (e: ThreeEvent<MouseEvent>) => void }>(function SafeValveDisplay({ onClick }, ref) {
	const { radius, segments } = defaultOrthoElementsConfig.safe_valve
	const { baseColor } = defaultOrthoElementsConfig.general
	return (
		<group ref={ref} onClick={onClick}>
			<AnimatedSphere args={[radius, segments, segments]}>
				{
					<meshStandardMaterial color={baseColor} opacity={0.5} transparent />
				}
			</AnimatedSphere>
		</group>

	)
})
export default SafeValveDisplay