import { FC, use, useEffect, useRef } from 'react'
import { defaultOrthoElementsConfig } from '../../../../../../../../lib/globalStore/defaultOrthoElementsConfig'
import { GraphNode } from '@/utils/graph/GraphNode'
import { Line, Vector3 } from 'three'


const OrthoPipe: FC<{ element: GraphNode }> = ({ element }) => {
	const { isSelected } = element.ui
	const { selectedColor, baseColor } = defaultOrthoElementsConfig.general
	const ref = useRef<Line>(null)
	useEffect(() => {
		if (ref.current) {
			const [fx, fy, fz] = element.parents[0].ui.position
			const firstPoint = new Vector3(fx, fy, fz)
			const [tx, ty, tz] = element.children[0].ui.position
			const secondPoint = new Vector3(tx, ty, tz)
			ref.current.geometry.setFromPoints([firstPoint, secondPoint])
		}
	})
	return (
		// @ts-ignore 
		<line ref={ref}>
			<bufferGeometry />
			<lineBasicMaterial
				color={isSelected ? selectedColor : baseColor}
				linewidth={4}
			/>
		</line>
	)
}

export default OrthoPipe