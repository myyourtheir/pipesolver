import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'


import { useContext, useRef } from 'react'
import { start } from 'repl'

import OrthoPipe from './Objects/mappedElements/OrthoPipe'
import OrthoProvider from './Objects/mappedElements/OrthoProvider'
import OrthoPump from './Objects/mappedElements/OrthoPump'
import OrthoConsumer from './Objects/mappedElements/OrthoConsumer'
import OrthoGateValve from './Objects/mappedElements/OrthoGateValve'
import OrthoSafeValve from './Objects/mappedElements/OrthoSafeValve'
import { CanvasContext, CanvasContextProps } from '..'
import { defaultOrthoElementsConfig } from '@/lib/globalStore/defaultOrthoElementsConfig'


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
					return <OrthoPipe element={elem} key={i} />
				}
				else if (elem.value.type === 'pump') {
					x += defaultOrthoElementsConfig.pump.width
					return <OrthoPump element={elem} key={i} />
				}
				else if (elem.value.type === 'provider') {
					const { height } = defaultOrthoElementsConfig.provider
					const startX = x + height / 2
					x += height
					return <OrthoProvider element={elem} key={i} />
				}
				else if (elem.value.type === 'consumer') {
					const { height } = defaultOrthoElementsConfig.consumer
					const startX = x + height / 2
					x += height
					return <OrthoConsumer element={elem} key={i} />
				}
				else if (elem.value.type === 'gate_valve') {
					const { height } = defaultOrthoElementsConfig.gate_valve
					const startX = x + height / 2
					x += height
					return <OrthoGateValve element={elem} key={i} />
				}
				else if (elem.value.type === 'safe_valve') {
					const { radius } = defaultOrthoElementsConfig.safe_valve
					const startX = x + 2 / 3 * radius
					x += 2 * 2 / 3 * radius
					return <OrthoSafeValve element={elem} key={i} />
				}
			})}
		</group>
	)
}

export default OrthograthicController