
import { Cylinder } from '@react-three/drei'
import { ElemProps } from './types'
import { FC } from 'react'
import { defaultElementsConfig } from '@/utils/defaultElementsConfig'



const Pipe: FC<ElemProps & { end: [number, number, number] }> = ({ start, end, isSelected }) => {
	const { diameter, radialSegments } = defaultElementsConfig.pipe
	return (
		<Cylinder args={[diameter, diameter, end[0] - start[0], radialSegments]} position={start} rotation={[0, 0, Math.PI / 2]}>
			{
				isSelected
					? <meshStandardMaterial color={defaultElementsConfig.general.selectedColor} />
					: <meshStandardMaterial />
			}
		</Cylinder>
	)
}

export default Pipe