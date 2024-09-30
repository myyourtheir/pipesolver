import { forwardRef } from 'react'
import { animated } from '@react-spring/three'
import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'
import { Group, Mesh } from 'three'

const PumpDisplay = forwardRef<Group, {}>(function PumpDisplay(props, ref) {
	const { width, height, depth } = defaultOrthoElementsConfig.pump
	const { baseColor } = defaultOrthoElementsConfig.general
	return (
		<group ref={ref}>
			<mesh >
				{
					<meshStandardMaterial color={baseColor} />
				}
				<boxGeometry args={[width, height, depth]} />
			</mesh>

		</group>
	)
})

export default PumpDisplay