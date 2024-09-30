import { Cylinder } from '@react-three/drei'
import { FC, forwardRef } from 'react'
import { animated } from '@react-spring/three'
import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'
import { Group, Mesh } from 'three'


const ProviderDisplay = forwardRef<Group, {}>(function ProviderDisplay(props, ref) {
	const { radiusBottom, radiusTop, radialSegments, height } = defaultOrthoElementsConfig.provider
	const { selectedColor, baseColor } = defaultOrthoElementsConfig.general
	return (
		<group ref={ref}>
			<Cylinder args={[radiusTop, radiusBottom, height, radialSegments]} rotation={[0, 0, Math.PI / 2]} >
				{
					<meshStandardMaterial color={baseColor} />
				}
			</Cylinder>
		</group>
	)
})

export default ProviderDisplay