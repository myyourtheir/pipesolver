import { Button } from '@/components/ui/button'
import calculatePumpAB from './calculatePumpAB'
import { FC } from 'react'
import { QH } from './QHTable'
import { PumpFormProps } from './PumpCoefsPopover'
interface ABCalculatorProps extends PumpFormProps {
	data: QH[],
	className?: string
}
const ABCalculator: FC<ABCalculatorProps> = ({ data, className, form }) => {
	const onClick = () => {
		const { a, b } = calculatePumpAB(data)
		form.setValue('coef_a', a)
		form.setValue('coef_b', b)
		console.log(a, b)
	}
	return (
		<div className='flex w-full justify-end mt-2'>
			<Button
				onClick={onClick}
				className={` ${className}`}
			>
				Заменить
			</Button>
		</div>
	)
}

export default ABCalculator