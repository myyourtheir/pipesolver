import { FC, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../../../../../../../../lib/globalStore/defaultOrthoElementsConfig'
import { animated } from '@react-spring/three'
import { Mesh } from 'three'
import useMovement from '../../../utils/hooks/useMovement'
import { UiConfig } from '../../../../../../../../../types/stateTypes'
import { GraphNode } from '@/utils/graph/GraphNode'
import LinkPoint from '../LinkPoint'
import { useSelectedElementModeContext } from '@/app/home/(contexts)/useSelectedElementMode'

const OrthoPump: FC<{ element: GraphNode }> = ({ element }) => {
	const { isSelected } = element.ui
	const { width, height, depth } = defaultOrthoElementsConfig.pump
	const { selectedColor, baseColor } = defaultOrthoElementsConfig.general
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ objectRef, currentElement: element })
	const { elementModeState: { mode } } = useSelectedElementModeContext()
	return (
		<animated.group ref={objectRef} {...bind() as any} {...spring}>
			<mesh >
				{
					<meshStandardMaterial color={isSelected ? selectedColor : baseColor} />
				}
				<boxGeometry args={[width, height, depth]} />
			</mesh>
			{
				mode === 'linierElement' &&
				<>
					<LinkPoint
						groupProps={{
							position: [0.35, 0, 2]
						}}
					/>
					<LinkPoint
						groupProps={{
							position: [-0.35, 0, 2]
						}}
					/>
				</>
			}
		</animated.group>
	)
}

export default OrthoPump