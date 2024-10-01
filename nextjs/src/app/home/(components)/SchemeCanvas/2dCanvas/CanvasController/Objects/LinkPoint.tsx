import { GroupProps } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Mesh } from 'three'

type LinkPointProps = {
	groupProps?: GroupProps
}

function LinkPoint({ groupProps }: LinkPointProps) {
	const innerCircleRef = useRef<Mesh>(null)
	const [innerRadius, setInnerRadius] = useState<number>(0.07)
	return (
		<group position={[0, 0, 6]} {...groupProps}>
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