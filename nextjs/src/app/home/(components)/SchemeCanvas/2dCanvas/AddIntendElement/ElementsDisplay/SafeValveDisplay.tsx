import { Sphere } from '@react-three/drei'
import { animated } from '@react-spring/three'
import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'
import { forwardRef } from 'react'
import { Group } from 'three'


const AnimatedSphere = animated(Sphere)

const SafeValveDisplay = forwardRef<Group, {}>(function SafeValveDisplay(props, ref) {
	const { radius, segments } = defaultOrthoElementsConfig.safe_valve
	const { baseColor } = defaultOrthoElementsConfig.general
	return (
		<group ref={ref}>
			<AnimatedSphere args={[radius, segments, segments]}>
				{
					<meshStandardMaterial color={baseColor} />
				}
			</AnimatedSphere>
		</group>

	)
})
export default SafeValveDisplay