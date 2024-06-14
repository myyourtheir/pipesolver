import { Button } from '@/components/ui/button'
import { useResultsStore } from '@/lib/globalStore/resultsStore'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { useCallUnsteadyFlowWs } from '@/utils/hooks/useCallUnsteadyFlowWs'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'

const CalcButton = () => {
	const { setIter, chartData } = useResultsStore()
	const { cond_params: { time_to_iter } } = useUnsteadyInputStore()
	const [isLoading, setIsLoading] = useState(false)
	const [calcUnsteadyFlow] = useCallUnsteadyFlowWs({ setIsLoading, isLoading })
	useEffect(() => {
		if (chartData.length >= time_to_iter) {
			setIsLoading(false)
		}
	}, [chartData.length, time_to_iter])

	return (
		<Button
			className='w-24'
			onClick={() => {
				if (isLoading) return
				const promise = new Promise((res, rej) => {
					res(setIter(0))
				})
				promise.then(() => {
					calcUnsteadyFlow()
				})
			}}
		>
			{
				isLoading
					? <Loader />
					: 'Расcчитать'
			}
		</Button>
	)
}

export default CalcButton