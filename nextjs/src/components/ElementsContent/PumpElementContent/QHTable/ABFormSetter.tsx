import { Button } from '@/components/ui/button'
import calculatePumpAB from './calculatePumpAB'
import { Dispatch, FC, SetStateAction } from 'react'
import { QH } from '.'
import { PumpFormProps } from '../PumpCoefsPopover'
interface ABCalculatorProps extends PumpFormProps {
	coefs: { a: number, b: number }
	className?: string,
}
const ABFormSetter: FC<ABCalculatorProps> = ({ coefs, className, form, }) => {
	const onClick = () => {
		form.setValue('coef_a', coefs.a)
		form.setValue('coef_b', parseFloat(coefs.b.toExponential(1)))
	}
	return (
		<div className='grid grid-cols-2 w-full justify-between mt-2'>
			<div className='flex flex-col gap-1 pl-8 justify-center'>
				<span> a: {coefs.a} </span>
				<span> b: {coefs.b}</span>
			</div>
			<div className='flex justify-end'>
				<Button
					onClick={onClick}
					className={` ${className}`}
				>
					Применить
				</Button>
			</div>
		</div>
	)
}

export default ABFormSetter