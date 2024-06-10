import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'


import { useContext, useRef } from 'react'
import { start } from 'repl'
import { defaultElementsConfig } from '@/utils/defaultElementsConfig'
import OrthoPipe from './Objects/mappedElements/OrthoPipe'
import OrthoProvider from './Objects/mappedElements/OrthoProvider'
import OrthoPump from './Objects/mappedElements/OrthoPump'
import OrthoConsumer from './Objects/mappedElements/OrthoConsumer'
import OrthoGateValve from './Objects/mappedElements/OrthoGateValve'
import OrthoSafeValve from './Objects/mappedElements/OrthoSafeValve'
import { CanvasContext, CanvasContextProps } from '..'


const ratio = 20
const OrthograthicController = () => {
	const { openPoints } = useContext(CanvasContext) as CanvasContextProps
	const elements = useUnsteadyInputStore(state => state.pipeline)
	let x = 0
	let y = 1
	let z = 0
	return (
		<group>
			{elements.nodes.map((elem, i) => { //TODO Тут логика добавления открытых точек
				if (elem.getNeighbours().length == 0) {
					openPoints.push([i + 1, i + 1])
				}

				if (elem.value.type === 'pipe') {
					const length = elem.value.length / ratio
					const startX = x + length / 2
					x += length
					return <OrthoPipe start={[startX, y, z]} end={[startX + length, y, z]} isSelected={elem.ui?.selected} key={i} />
				}
				else if (elem.value.type === 'pump') {
					x += defaultElementsConfig.pump.width
					return <OrthoPump start={[x - defaultElementsConfig.pump.width / 2, y, z]} isSelected={elem.ui?.selected} key={i} />
				}
				else if (elem.value.type === 'provider') {
					const { height } = defaultElementsConfig.provider
					const startX = x + height / 2
					x += height
					return <OrthoProvider start={[startX, y, z]} isSelected={elem.ui?.selected} key={i} />
				}
				else if (elem.value.type === 'consumer') {
					const { height } = defaultElementsConfig.consumer
					const startX = x + height / 2
					x += height
					return <OrthoConsumer start={[startX, y, z]} isSelected={elem.ui?.selected} key={i} />
				}
				else if (elem.value.type === 'gate_valve') {
					const { height } = defaultElementsConfig.gateValve
					const startX = x + height / 2
					x += height
					return <OrthoGateValve start={[startX, y, z]} isSelected={elem.ui?.selected} key={i} />
				}
				else if (elem.value.type === 'safe_valve') {
					const { radius } = defaultElementsConfig.safeValve
					const startX = x + 2 / 3 * radius
					x += 2 * 2 / 3 * radius
					return <OrthoSafeValve start={[startX, y, z]} isSelected={elem.ui?.selected} key={i} />
				}
			})}
		</group>
	)
}

export default OrthograthicController