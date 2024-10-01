
import { usePipeElementContext } from '@/app/home/(contexts)/useNewPipeElementContext'
import { GraphNode } from '@/utils/graph/GraphNode'
import { GroupProps } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Mesh } from 'three'

type LinkPointProps = {
	groupProps?: GroupProps,
	element: GraphNode
}

function LinkPoint({ groupProps, element }: LinkPointProps) {
	const innerCircleRef = useRef<Mesh>(null)
	const [innerRadius, setInnerRadius] = useState<number>(0.07)
	const { dispatch, state: { isActive } } = usePipeElementContext()

	const handleClick = () => {
		if (!isActive) {
			dispatch({ type: 'setParentElement', value: element })
			dispatch({ type: 'setIsActive', value: true })
		} else {
			dispatch({ type: 'setChildElement', value: element })
			dispatch({ type: 'setIsActive', value: false })
		}
		// TODO Добавить логику доьавления узла
	}

	return (
		<group
			onClick={handleClick}
			position={[0, 0, 6]}
			{...groupProps}

		>
			<mesh
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