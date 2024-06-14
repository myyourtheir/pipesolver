import { Button } from '@/components/ui/button'
import { useResultsStore } from '@/lib/globalStore/resultsStore'
import { useCallUnsteadyFlowWs } from '@/utils/hooks/useCallUnsteadyFlowWs'
import { Loader } from 'lucide-react'
import { useState } from 'react'

const CalcButton = () => {
	const { setIter } = useResultsStore()
	const [isLoading, setIsLoading] = useState(false)
	const [calcUnsteadyFlow] = useCallUnsteadyFlowWs({ setIsLoading, isLoading })
	return (
		<Button
			className='w-24'
			onClick={() => {
				if (isLoading) return
				const promise = new Promise((res, rej) => {
					res(setIter(0))
				})
				promise.then(() =>
					calcUnsteadyFlow()
				)
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