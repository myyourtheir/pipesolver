import { Cylinder } from '@react-three/drei'
import { FC, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../../../../../../../../lib/globalStore/defaultOrthoElementsConfig'
import { Mesh } from 'three'
import { animated } from '@react-spring/three'
import useMovement from '../../../utils/hooks/useMovement'
import { GraphNode } from '@/utils/graph/GraphNode'
import { useSelectedElementModeContext } from '@/app/home/(contexts)/useSelectedElementMode'
import LinkPoint from '../LinkPoint'


const AnimatedCylinder = animated(Cylinder)

const OrthoProvider: FC<{ element: GraphNode }> = ({ element }) => {
	const { isSelected } = element.ui
	const { radiusBottom, radiusTop, radialSegments, height } = defaultOrthoElementsConfig.provider
	const { selectedColor, baseColor } = defaultOrthoElementsConfig.general
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ objectRef, currentElement: element })
	const { elementModeState: { mode } } = useSelectedElementModeContext()
	return (
		<animated.group ref={objectRef} {...bind() as any} {...spring}>
			<AnimatedCylinder args={[radiusTop, radiusBottom, height, radialSegments]} {...bind() as any} rotation={[0, 0, Math.PI / 2]} >
				{
					<meshStandardMaterial color={isSelected ? selectedColor : baseColor} />
				}
			</AnimatedCylinder>
			{
				mode === 'linierElement' &&
				<>
					{
						element.ui.openPoints.includes('right') &&
						<LinkPoint
							side='right'
							element={element}
						/>
					}
				</>
			}
		</animated.group>
	)
}

export default OrthoProvider