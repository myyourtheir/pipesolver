import { forwardRef } from 'react'
import { ElementParamsUnion } from '../../../../../../../../types/stateTypes'
import ConsumerDisplay from './ConsumerDisplay'
import GateValveDisplay from './GateValveDisplay'
import ProviderDisplay from './ProviderDisplay'
import PumpDisplay from './PumpDisplay'
import SafeValveDisplay from './SafeValveDisplay'
import { Group, Mesh } from 'three'
import { ThreeEvent } from '@react-three/fiber'
import TeeDisplay from './TeeDispaly'

type ElementsDisplayProps = {
	onClick: (e: ThreeEvent<MouseEvent>) => void,
	elemType: ElementParamsUnion['type'] | null
}

const ElementsDisplay = forwardRef<Group, ElementsDisplayProps>(function ElementsDisplay({ elemType, onClick }, ref) {
	if (elemType === 'pump') {
		return < PumpDisplay onClick={onClick} ref={ref} />
	}
	else if (elemType === 'provider') {
		return < ProviderDisplay onClick={onClick} ref={ref} />
	}
	else if (elemType === 'consumer') {
		return < ConsumerDisplay onClick={onClick} ref={ref} />
	}
	else if (elemType === 'gate_valve') {
		return < GateValveDisplay onClick={onClick} ref={ref} />
	}
	else if (elemType === 'safe_valve') {
		return < SafeValveDisplay onClick={onClick} ref={ref} />
	}
	else if (elemType === 'tee') {
		return < TeeDisplay onClick={onClick} ref={ref} />
	}
	return null
})

export default ElementsDisplay