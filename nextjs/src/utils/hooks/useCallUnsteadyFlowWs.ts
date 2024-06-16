import { toast } from 'sonner'
import { useResultsStore } from '../../lib/globalStore/resultsStore'
import { useUnsteadyInputStore } from '../../lib/globalStore/unsteadyFlowStore'
import { GraphNode } from '../graph/GraphNode'
import { Dispatch, FC, SetStateAction } from 'react'


const url = process.env.BASE_URL


export const useCallUnsteadyFlowWs = (
	{ setIsLoading, isLoading }
		: {
			setIsLoading: Dispatch<SetStateAction<boolean>>,
			isLoading: boolean
		}) => {
	const { cond_params, pipeline } = useUnsteadyInputStore(state => state)
	const { pushNewData, resetResult, chartData } = useResultsStore(state => state)

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
		console.log(pipeline.nodes.map(el => {
			return {
				id: el.id,
				type: el.value.type,
				parents: el.parents.map(el => el.id),
				children: el.children.map(el => el.id)
			}
		}))
		if (isValidPipeline.isConusmer == true && isValidPipeline.isPipe == true) {
			setIsLoading(true)
			resetResult()
			const ws = new WebSocket(`ws://${url}/unsteady_flow`)
			ws.onerror = (ev) => {
				console.error
			}
			const timeToIter = cond_params.time_to_iter
			const message2 = JSON.stringify(
				{
					cond_params,
					pipeline: pipeline.toObj()
				}
			)
			console.log(pipeline.toObj())
			ws.onopen = (ev) => {
				ws.send(message2)
			}
			ws.onmessage = (event) => {
				const data = JSON.parse(event.data)
				pushNewData(data)
			}
		} else {
			toast.warning("Трубопровод должен содержать минимум 1 трубу и потребителя")
		}
	}

	return [calcUnsteadyFlow]
}