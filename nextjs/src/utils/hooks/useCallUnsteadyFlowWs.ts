import { toast } from 'sonner'
import { useResultsStore } from '../../lib/globalStore/resultsStore'
import { useUnsteadyInputStore } from '../../lib/globalStore/unsteadyFlowStore'
import { GraphNode } from '../graph/GraphNode'
import { Dispatch, FC, SetStateAction } from 'react'
import { ResultMomentData } from '../../../types/stateTypes'


const url = process.env.BASE_URL

type Recieved = {
	status: "OK" | "ERROR" | "INFO",
	data?: ResultMomentData
	message?: string
}
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
		if (isValidPipeline.isConusmer && isValidPipeline.isPipe) {
			setIsLoading(true)
			resetResult()
			const ws = new WebSocket(`ws://${url}/unsteady_flow`)
			ws.onerror = (ev) => {
				console.error
			}
			const message = JSON.stringify(
				{
					cond_params,
					pipeline: pipeline.toObj()
				}
			)
			console.log(pipeline.toObj())
			ws.onopen = (ev) => {
				ws.send(message)
			}
			ws.onmessage = (event) => {
				const data: Recieved = JSON.parse(event.data)
				if (data.status === "OK") {
					const result = data.data
					if (result) {
						pushNewData(result)
					}
				}
			}
			ws.onclose = (e) => {
				const message = e.reason
				const code = e.code
				if (code === 1000) {
					toast(message)
				}
				else {
					toast.warning(message)
				}
				setIsLoading(false)
			}
		} else {
			toast.warning("Трубопровод должен содержать минимум 1 трубу и потребителя")
		}
	}

	return [calcUnsteadyFlow]
}