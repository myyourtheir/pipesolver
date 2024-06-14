
import { Cylinder } from '@react-three/drei'
import { FC, useRef } from 'react'

import useMovement from '../../../hooks/useMovement'
import { defaultOrthoElementsConfig } from '../../../../../../../../lib/globalStore/defaultOrthoElementsConfig'
import { Mesh } from 'three'
import { animated } from '@react-spring/three'
import { PipeParams, UiConfig } from '../../../../../../../../../types/stateTypes'
import { GraphNode } from '@/utils/graph/GraphNode'

const AnimatedCylinder = animated(Cylinder)

const OrthoPipe: FC<{ element: GraphNode }> = ({ element }) => {
	const { diameter, radialSegments } = defaultOrthoElementsConfig.pipe
	const { position, isSelected } = element.ui
	const { selectedColor, baseColor } = defaultOrthoElementsConfig.general
	const length = (element.value as PipeParams).length / 100
	const objectRef = useRef<Mesh>(null!)
	const { bind, spring } = useMovement({ position, objectRef })
	return (
		<AnimatedCylinder {...bind() as any} ref={objectRef} args={[diameter, diameter, length, radialSegments]} rotation={[0, 0, Math.PI / 2]}  {...spring}>
			{
				<meshStandardMaterial color={isSelected ? selectedColor : baseColor} />
			}
		</AnimatedCylinder>
	)
}

export default OrthoPipe