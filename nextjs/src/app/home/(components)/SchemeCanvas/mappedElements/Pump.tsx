import { FC } from 'react'
import { ElemProps } from './types'
import { defaultElementsConfig } from '@/utils/defaultElementsConfig'


const Pump: FC<ElemProps> = ({ start, isSelected }) => {
	const { width, height, depth } = defaultElementsConfig.pump
	return (
		<mesh position={start}>
			{
				isSelected
					? <meshStandardMaterial color={defaultElementsConfig.general.selectedColor} />
					: <meshStandardMaterial />
			}
			<boxGeometry args={[width, height, depth]} />
		</mesh>
	)
}

export default Pump