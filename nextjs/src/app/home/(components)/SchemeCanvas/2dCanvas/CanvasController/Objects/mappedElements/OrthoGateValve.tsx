import { Cylinder } from '@react-three/drei'
import { FC, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../../../../../../../../lib/globalStore/defaultOrthoElementsConfig'
import { animated } from '@react-spring/three'
import { Mesh } from 'three'
import useMovement from '../../../utils/hooks/useMovement'
import { GraphNode } from '@/utils/graph/GraphNode'
import LinkPoint from '../LinkPoint'
import { useSelectedElementModeContext } from '@/app/home/(contexts)/useSelectedElementMode'

const OrthoGateValve: FC<{ element: GraphNode }> = ({ element }) => {
	const { isSelected } = element.ui
	const { radiusBottom, radiusTop, radialSegments, height } = defaultOrthoElementsConfig.consumer
	const { selectedColor, baseColor } = defaultOrthoElementsConfig.general
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ objectRef, currentElement: element })
	const { elementModeState: { mode } } = useSelectedElementModeContext()
	return (
		<animated.group ref={objectRef} {...bind() as any} {...spring}>

			<Cylinder args={[radiusBottom, radiusTop, height, radialSegments]} rotation={[0, 0, Math.PI / 2]}>
				{
					<meshStandardMaterial color={isSelected ? selectedColor : baseColor} />
				}
			</Cylinder>
			<Cylinder args={[radiusTop, radiusBottom, height, radialSegments]} rotation={[0, 0, Math.PI / 2]}>
				{
					<meshStandardMaterial color={isSelected ? defaultOrthoElementsConfig.general.selectedColor : ''} />
				}
			</Cylinder>
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
export default OrthoGateValve