
import Pump from '@/app/home/(components)/SchemeCanvas/3dCanvas/mappedElements/Pump'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import Pipe from './mappedElements/Pipe'


import { useRef } from 'react'
import { start } from 'repl'
import { defaultElementsConfig } from '@/utils/defaultElementsConfig'
import PipeLineProvider from './mappedElements/PipeLineProvider'
import PipeLineConsumer from './mappedElements/PipeLineConsumer'
import GateValve from './mappedElements/GateValve'
import SafeValve from './mappedElements/SafeValve'

const ratio = 20
const ElementsController = () => {

	const elements = useUnsteadyInputStore(state => state.pipeline)
	let x = 0
	let y = 1
	let z = 0
	return (
		<group>
			{elements.nodes.map((elem, i) => {

				if (elem.value.type === 'pipe') {
					const length = elem.value.length / ratio
					const startX = x + length / 2
					x += length
					return <Pipe start={[startX, y, z]} end={[startX + length, y, z]} isSelected={elem.value.uiConfig?.selected} key={i} />
				}
				else if (elem.value.type === 'pump') {
					x += defaultElementsConfig.pump.width
					return <Pump start={[x - defaultElementsConfig.pump.width / 2, y, z]} isSelected={elem.value.uiConfig?.selected} key={i} />
				}
				else if (elem.value.type === 'provider') {
					const { height } = defaultElementsConfig.provider
					const startX = x + height / 2
					x += height
					return <PipeLineProvider start={[startX, y, z]} isSelected={elem.value.uiConfig?.selected} key={i} />
				}
				else if (elem.value.type === 'consumer') {
					const { height } = defaultElementsConfig.consumer
					const startX = x + height / 2
					x += height
					return <PipeLineConsumer start={[startX, y, z]} isSelected={elem.value.uiConfig?.selected} key={i} />
				}
				else if (elem.value.type === 'gate_valve') {
					const { height } = defaultElementsConfig.gateValve
					const startX = x + height / 2
					x += height
					return <GateValve start={[startX, y, z]} isSelected={elem.value.uiConfig?.selected} key={i} />
				}
				else if (elem.value.type === 'safe_valve') {
					const { radius } = defaultElementsConfig.safeValve
					const startX = x + 2 / 3 * radius
					x += 2 * 2 / 3 * radius
					return <SafeValve start={[startX, y, z]} isSelected={elem.value.uiConfig?.selected} key={i} />
				}
			})}
		</group>
	)
}

export default ElementsController