import { forwardRef } from 'react'
import { ElementParamsUnion } from '../../../../../../../../types/stateTypes'
import ConsumerDisplay from './ConsumerDisplay'
import GateValveDisplay from './GateValveDisplay'
import ProviderDisplay from './ProviderDisplay'
import PumpDisplay from './PumpDisplay'
import SafeValveDisplay from './SafeValveDisplay'
import { Group, Mesh } from 'three'

const ElementsDisplay = forwardRef<Group, { elemType: ElementParamsUnion['type'] | null }>(function ElementsDisplay({ elemType }, ref) {
	if (elemType === 'pump') {
		return < PumpDisplay ref={ref} />
	}
	else if (elemType === 'provider') {
		return < ProviderDisplay ref={ref} />
	}
	else if (elemType === 'consumer') {
		return < ConsumerDisplay ref={ref} />
	}
	else if (elemType === 'gate_valve') {
		return < GateValveDisplay ref={ref} />
	}
	else if (elemType === 'safe_valve') {
		return < SafeValveDisplay ref={ref} />
	}
	return null
})

export default ElementsDisplay