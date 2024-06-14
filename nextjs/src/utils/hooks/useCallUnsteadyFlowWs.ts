import { toast } from 'sonner'
import { useResultsStore } from '../../lib/globalStore/resultsStore'
import { useUnsteadyInputStore } from '../../lib/globalStore/unsteadyFlowStore'
import { GraphNode } from '../graph/GraphNode'


const url = process.env.BASE_URL


export const useCallUnsteadyFlowWs = () => {
	const { cond_params, pipeline } = useUnsteadyInputStore(state => state)
	const { pushNewData, resetResult } = useResultsStore(state => state)

	const isValidPipeline = pipeline.nodes.reduce((acc, item) => {
		if (item.value.type === 'pipe') {
			acc.isPipe = true
		}
		if (item.value.type === 'consumer') {
			acc.isConusmer = true
		}
		return acc
	}, {
		isPipe: false,
		isConusmer: false
	})

	const calcUnsteadyFlow = () => {

		if (isValidPipeline.isConusmer == true && isValidPipeline.isPipe == true) {
			resetResult()
			const ws = new WebSocket(`ws://${url}/unsteady_flow`)
			ws.onerror = (ev) => {
				console.error
			}
			const message = JSON.stringify(
				{
					cond_params,
					pipeline: pipeline.nodes.map(node => node.value)
				}
			)
			// ------------------------------------------------------------------------------------

			const message2 = JSON.stringify(
				{
					cond_params,
					pipeline: pipeline.toObj()
				}
			)
			console.log(pipeline.toObj())
			// ------------------------------------------------------------------------------------
			ws.onopen = (ev) => {
				ws.send(message2)
			}
			ws.onmessage = (ev) => {
				pushNewData(JSON.parse(ev.data))
			}
		} else {
			toast.warning("Трубопровод должен содержать минимум 1 трубу и потребителя")
		}
	}

	return [calcUnsteadyFlow]
}