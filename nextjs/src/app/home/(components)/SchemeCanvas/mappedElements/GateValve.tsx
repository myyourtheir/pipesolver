import { Cylinder } from '@react-three/drei'
import { ElemProps } from './types'
import { FC } from 'react'
import { defaultElementsConfig } from '@/utils/defaultElementsConfig'

const GateValve: FC<ElemProps> = ({ start, isSelected }) => {
	const { radiusBottom, radiusTop, radialSegments, height } = defaultElementsConfig.consumer
	return (
		<group position={start}>

			<Cylinder args={[radiusBottom, radiusTop, height, radialSegments]} rotation={[0, 0, Math.PI / 2]}>
				{
					isSelected
						? <meshStandardMaterial color={defaultElementsConfig.general.selectedColor} />
						: <meshStandardMaterial />
				}
			</Cylinder>
			<Cylinder args={[radiusTop, radiusBottom, height, radialSegments]} rotation={[0, 0, Math.PI / 2]}>
				{
					isSelected
						? <meshStandardMaterial color={defaultElementsConfig.general.selectedColor} />
						: <meshStandardMaterial />
				}
			</Cylinder>
		</group>
	)
}
export default GateValve