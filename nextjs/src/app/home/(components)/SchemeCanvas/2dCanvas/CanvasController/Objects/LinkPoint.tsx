
import { usePipeElementContext } from '@/app/home/(contexts)/useNewPipeElementContext'
import { GraphNode } from '@/utils/graph/GraphNode'
import { GroupProps } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Mesh } from 'three'
import { Sides, UiConfig } from '../../../../../../../../types/stateTypes'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { useDefaultElementsConfig } from '@/app/home/(contexts)/useDefaultElementsConfig'
import { ElementLinksPointPosition } from './utils/ElementLinksPointPosition'

type LinkPointProps = {
	groupProps?: GroupProps,
	element: GraphNode,
	side: Sides
}

function LinkPoint({ groupProps, element, side }: LinkPointProps) {
	const innerCircleRef = useRef<Mesh>(null)
	const [innerRadius, setInnerRadius] = useState<number>(0.07)
	const { dispatch, state: { isActive, parentElement, parentElementSide } } = usePipeElementContext()
	const { removeOpenSide, addPipe } = useUnsteadyInputStore()
	const { defaultValues } = useDefaultElementsConfig()
	const handleClick = () => {
		if (!isActive) {
			dispatch({
				type: 'setParentElement', value: {
					parentElement: element,
					parentElementSide: side
				}
			})
		} else {
			if (parentElement) {
				const newElem = defaultValues['pipe']
				const newUi: UiConfig = {
					isSelected: false,
					position: [0, 0, 0],
					length: 0,
					openPoints: element.ui.openPoints,
					pipeNeighbours: {
						[element.id]: side,
						[parentElement.id]: parentElementSide as Sides
					}
				}
				removeOpenSide(element, side)
				removeOpenSide(parentElement, parentElementSide as Sides)
				addPipe(newElem, newUi, parentElement!, element)
				dispatch({ type: 'resetParentElement' })
			}
		}
	}

	return (
		<group
			// @ts-ignore 
			position={ElementLinksPointPosition[element.value.type][side]}
			{...groupProps}

		>
			<mesh
				onClick={handleClick}
				onPointerOver={(e) => {
					setInnerRadius(0.1)
				}}
				onPointerOut={(e) => {
					setInnerRadius(0.07)
				}}
			>
				<circleGeometry args={[0.15, 32]} />
				<meshBasicMaterial color={'black'} />
			</mesh>
			<mesh
				ref={innerCircleRef}
			>
				<circleGeometry args={[innerRadius, 32]} />
				<meshBasicMaterial color={'white'} />
			</mesh>
		</group>
	)
}

export default LinkPoint