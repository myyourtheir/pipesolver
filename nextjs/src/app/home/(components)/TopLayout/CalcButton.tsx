import { Button } from '@/components/ui/button'
import { useResultsStore } from '@/lib/globalStore/resultsStore'
import { useCallUnsteadyFlowWs } from '@/utils/hooks/useCallUnsteadyFlowWs'

const CalcButton = () => {
	const { setIter } = useResultsStore()
	const [calcUnsteadyFlow] = useCallUnsteadyFlowWs()
	return (
		<Button
			className='w-fit'
			onClick={() => {
				const promise = new Promise((res, rej) => {
					res(setIter(0))
				})
				promise.then(() =>
					calcUnsteadyFlow()
				)
			}}
		>
			Расcчитать
		</Button>
	)
}

export default CalcButton