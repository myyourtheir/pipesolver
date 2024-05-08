import { toast } from 'sonner'
import { UnsteadyChartData } from '../../types/stateTypes'
import { useResultsStore } from '../lib/globalStore/resultsStore'
import { useUnsteadyInputStore } from '../lib/globalStore/unsteadyFlowStore'


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

			ws.onopen = (ev) => {
				ws.send(JSON.stringify(
					{
						cond_params,
						pipeline: pipeline.nodes.map(node => node.value)
					}
				))
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