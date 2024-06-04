import { Cylinder } from '@react-three/drei'
import { ElemProps } from './types'
import { FC } from 'react'
import { defaultElementsConfig } from '@/utils/defaultElementsConfig'

const PipeLineConsumer: FC<ElemProps> = ({ start, isSelected }) => {
	const { radiusBottom, radiusTop, radialSegments, height } = defaultElementsConfig.consumer
	return (
		<Cylinder args={[radiusTop, radiusBottom, height, radialSegments]} position={start} rotation={[0, 0, Math.PI / 2]}>
			{
				isSelected
					? <meshStandardMaterial color={defaultElementsConfig.general.selectedColor} />
					: <meshStandardMaterial />
			}
		</Cylinder>
	)
}

export default PipeLineConsumer