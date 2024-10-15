import { Button } from '@/components/ui/button'
import CalcButton from './CalcButton'
import TimeToIterForm from './TimeToIterForm'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'


const CalcAndTimeBlock = () => {
	const { cond_params, updateCondParams } = useUnsteadyInputStore()
	return (
		<div className='justify-end flex gap-2 px-4'>
			<TimeToIterForm defaultValues={cond_params} onSubmit={updateCondParams} />
			<CalcButton />
		</div>
	)
}

export default CalcAndTimeBlock