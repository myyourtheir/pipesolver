import { Button } from '@/components/ui/button'
import calculatePumpAB from './calculatePumpAB'
import { Dispatch, FC, SetStateAction } from 'react'
import { QH } from '.'
import { PumpFormProps } from '../PumpCoefsPopover'
interface ABCalculatorProps extends PumpFormProps {
	data: QH[],
	className?: string,
	setCoefs: Dispatch<SetStateAction<{
		a: number
		b: number
	}>>
}
const ABCalculator: FC<ABCalculatorProps> = ({ data, className, form, setCoefs }) => {
	const onClick = () => {
		const { a, b } = calculatePumpAB(data)
		form.setValue('coef_a', a)
		form.setValue('coef_b', b)
		setCoefs({
			a, b
		})
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