import { FC, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../../../../../../../../lib/globalStore/defaultOrthoElementsConfig'
import { animated } from '@react-spring/three'
import { Mesh } from 'three'
import useMovement from '../../../utils/hooks/useMovement'
import { UiConfig } from '../../../../../../../../../types/stateTypes'
import { GraphNode } from '@/utils/graph/GraphNode'
import LinkPoint from '../LinkPoint'
import { useSelectedElementModeContext } from '@/app/home/(contexts)/useSelectedElementMode'

const OrthoTee: FC<{ element: GraphNode }> = ({ element }) => {
	const { isSelected } = element.ui
	const { selectedColor, baseColor } = defaultOrthoElementsConfig.general
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ objectRef, currentElement: element })
	const { elementModeState: { mode } } = useSelectedElementModeContext()
	const { height, width, depth } = defaultOrthoElementsConfig.tee

	const secHeight = height / 5 * 4
	const secWidth = width / 3
	const secDepth = depth / 2
	return (
		<animated.group ref={objectRef} {...bind() as any} {...spring}>
			<mesh >
				<meshStandardMaterial color={isSelected ? selectedColor : baseColor} />
				<boxGeometry args={[width, height, depth]} />
			</mesh>
			<mesh position={[0, secWidth / 2 + height / 2, 1]} rotation={[0, 0, Math.PI / 2]}>
				<meshStandardMaterial color={isSelected ? selectedColor : baseColor} />
				<boxGeometry args={[secWidth, secHeight, secDepth]} />
			</mesh>
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
					{
						element.ui.openPoints.includes('top') &&
						<LinkPoint
							side='top'
							element={element}
						/>
					}
				</>
			}
		</animated.group>
	)
}

export default OrthoTee