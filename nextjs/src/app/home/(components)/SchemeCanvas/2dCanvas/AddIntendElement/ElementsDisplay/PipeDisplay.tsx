import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'
import { forwardRef } from 'react'
import * as THREE from 'three'

type PipeDisplayProps = {

}

const PipeDisplay = forwardRef<THREE.Line, PipeDisplayProps>(function PipeDisplay({ }, ref) {
	const { baseColor } = defaultOrthoElementsConfig.general
	return (
		// @ts-ignore
		<line ref={ref} >
			<bufferGeometry />
			<lineBasicMaterial color={baseColor} linewidth={4} />
		</line>
	)
})

export default PipeDisplay