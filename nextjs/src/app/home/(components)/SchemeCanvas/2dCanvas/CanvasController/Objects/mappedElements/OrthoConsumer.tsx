import { Cylinder } from '@react-three/drei'
import { FC, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../../../../../../../../lib/globalStore/defaultOrthoElementsConfig'
import { animated } from '@react-spring/three'
import { Mesh } from 'three'
import useMovement from '../../../utils/hooks/useMovement'
import { GraphNode } from '@/utils/graph/GraphNode'
import { useSelectedElementModeContext } from '@/app/home/(contexts)/useSelectedElementMode'
import LinkPoint from '../LinkPoint'

const AnimatedCylinder = animated(Cylinder)

const OrthoConsumer: FC<{ element: GraphNode }> = ({ element }) => {
	const { isSelected } = element.ui
	const { radiusBottom, radiusTop, radialSegments, height } = defaultOrthoElementsConfig.consumer
	const { selectedColor, baseColor } = defaultOrthoElementsConfig.general
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ objectRef, currentElement: element })
	const { elementModeState: { mode } } = useSelectedElementModeContext()
	return (
		<animated.group ref={objectRef} {...spring} {...bind() as any}>
			<Cylinder args={[radiusTop, radiusBottom, height, radialSegments]} rotation={[0, 0, Math.PI / 2]}>
				{
					<meshStandardMaterial color={isSelected ? selectedColor : baseColor} />
				}
			</Cylinder>
			{
				mode === 'linierElement' &&
				<>
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

export default OrthoConsumer