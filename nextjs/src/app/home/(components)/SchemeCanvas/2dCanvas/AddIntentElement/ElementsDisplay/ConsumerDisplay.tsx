import { Cylinder } from '@react-three/drei'
import { animated, AnimatedComponent } from '@react-spring/three'
import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'
import { forwardRef, ReactNode } from 'react'
import { Group, Mesh } from 'three'

const ConsumerDisplay = forwardRef<Group, {}>(function ConsumerDisplay(props, ref) {
	const { radiusBottom, radiusTop, radialSegments, height } = defaultOrthoElementsConfig.consumer
	const { baseColor } = defaultOrthoElementsConfig.general
	return (
		<group ref={ref}>
			<Cylinder args={[radiusTop, radiusBottom, height, radialSegments]} rotation={[0, 0, Math.PI / 2]}>
				{
					<meshStandardMaterial color={baseColor} />
				}
			</Cylinder>
		</group>
	)
})

export default ConsumerDisplay