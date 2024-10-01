import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'
import { Line, Line2Props, LineProps } from '@react-three/drei'
import { ForwardRefComponent } from '@react-three/drei/helpers/ts-utils'
import { forwardRef, LegacyRef, Ref } from 'react'
import * as THREE from 'three'

type PipeDisplayProps = {

}

const PipeDisplay = forwardRef<THREE.Mesh, PipeDisplayProps>(function PipeDisplay({ }, ref) {
	const { diameter, radialSegments } = defaultOrthoElementsConfig.pipe
	const { baseColor } = defaultOrthoElementsConfig.general
	return (
		<mesh ref={ref}>
			<lineBasicMaterial color={baseColor} transparent opacity={0.5} />
		</mesh>
	)
})

export default PipeDisplay