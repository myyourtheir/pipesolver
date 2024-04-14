import { Cylinder, Sphere } from '@react-three/drei'
import { ElemProps } from './types'
import { FC } from 'react'
import { defaultElementsConfig } from '@/utils/defaultElementsConfig'

const SafeValve: FC<ElemProps> = ({ start, isSelected }) => {
	const { radius, segments, boxDepth, boxHeight, boxWidth } = defaultElementsConfig.safeValve
	return (
		<group>
			{/* <ambientLight /> */}
			<Sphere args={[radius, segments, segments]} position={start}>
				{
					isSelected
						? <meshStandardMaterial color={defaultElementsConfig.general.selectedColor} />
						: <meshStandardMaterial />
				}
			</Sphere>
			<mesh position={[start[0], start[1] + 2 / 3 * radius + boxHeight / 2, start[2]]}>
				<boxGeometry args={[boxWidth, boxHeight, boxDepth]} />
				{
					isSelected
						? <meshStandardMaterial color={defaultElementsConfig.general.selectedColor} />
						: <meshStandardMaterial />
				}
			</mesh>
		</group>

	)
}
export default SafeValve