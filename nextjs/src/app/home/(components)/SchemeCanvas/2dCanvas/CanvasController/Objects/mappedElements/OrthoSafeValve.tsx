import { Cylinder, Sphere } from '@react-three/drei'
import { FC, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../../../../../../../../lib/globalStore/defaultOrthoElementsConfig'
import { animated } from '@react-spring/three'
import { Mesh } from 'three'
import useMovement from '../../../utils/hooks/useMovement'
import { GraphNode } from '@/utils/graph/GraphNode'
import LinkPoint from '../LinkPoint'
import { useSelectedElementModeContext } from '@/app/home/(contexts)/useSelectedElementMode'


const AnimatedSphere = animated(Sphere)

const OrthoSafeValve: FC<{ element: GraphNode }> = ({ element }) => {
	const { isSelected } = element.ui
	const { radius, segments, boxDepth, boxHeight, boxWidth } = defaultOrthoElementsConfig.safe_valve
	const { selectedColor, baseColor } = defaultOrthoElementsConfig.general
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ objectRef, currentElement: element })
	const { elementModeState: { mode } } = useSelectedElementModeContext()
	return (
		<animated.group  {...bind() as any} {...spring}>
			<AnimatedSphere ref={objectRef} args={[radius, segments, segments]} >
				{
					<meshStandardMaterial color={isSelected ? selectedColor : baseColor} />
				}
			</AnimatedSphere>
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
					{
						element.ui.openPoints.includes('left') &&
						<LinkPoint
							side='left'
							element={element}
						/>
					}
				</>
			}
		</animated.group>

	)
}
export default OrthoSafeValve