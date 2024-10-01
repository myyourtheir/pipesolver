import { ThreeEvent, useFrame } from '@react-three/fiber'
import { forwardRef, useRef } from 'react'
import * as THREE from 'three'
import { ElementParamsUnion, UiConfig } from '../../../../../../../types/stateTypes'
import ElementsDisplay from './ElementsDisplay'
import { ModeState, useSelectedElementModeContext } from '@/app/home/(contexts)/useSelectedElementMode'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'
import { useDefaultElementsConfig } from '@/app/home/(contexts)/useDefaultElementsConfig'
import PipeDisplay from './ElementsDisplay/PipeDisplay'
import { redirect } from 'next/dist/server/api-utils'
import { LineProps } from '@react-three/drei'
import AddIntendNonLinierElement from './AddIntendNonLinierElement'
import AddIntendLinierElement from './AddIntendLinierElement'

const vec = new THREE.Vector3()

const AddIntendElement = ({ mode }: { mode: ModeState['mode'] }) => {
	return (
		<>
			{
				mode == 'linierElement' ?
					<AddIntendLinierElement />
					: <AddIntendNonLinierElement />
			}
		</>
	)
}

export default AddIntendElement



