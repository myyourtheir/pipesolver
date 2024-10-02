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


const OrthograthicController = () => {
	const { pipeline: elements } = useUnsteadyInputStore()
	return (
		<group>
			{elements.nodes.map((elem, i) => {

				if (elem.value.type === 'pipe') {

					return <OrthoPipe element={elem} key={elem.id} />
				}
				else if (elem.value.type === 'pump') {

					return <OrthoPump element={elem} key={elem.id} />
				}
				else if (elem.value.type === 'provider') {
					return <OrthoProvider element={elem} key={elem.id} />
				}
				else if (elem.value.type === 'consumer') {
					return <OrthoConsumer element={elem} key={elem.id} />
				}
				else if (elem.value.type === 'gate_valve') {
					return <OrthoGateValve element={elem} key={elem.id} />
				}
				else if (elem.value.type === 'safe_valve') {
					return <OrthoSafeValve element={elem} key={elem.id} />
				}
			})}
		</group>
	)
}

export default OrthograthicController