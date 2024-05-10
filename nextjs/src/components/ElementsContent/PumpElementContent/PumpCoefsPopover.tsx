import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import PumpQHTable from './QHTable'
import { FC, useState } from 'react'
import ABCalculator from './QHTable/ABCalculator'
import { UseFormReturn } from 'react-hook-form'
import QHChart from './QHChart'

export interface PumpFormProps {
	form: UseFormReturn<{
		type: "pump"
		mode: "open" | "close"
		duration: number
		coef_a: number
		coef_b: number
		start_time: number
	}, any, undefined>
}

const PumpCoefsPopover: FC<PumpFormProps> = ({ form }) => {
	const [data, setData] = useState(
		[{
			Q: 8000,
			H: 243
		},
		{
			Q: 8500,
			H: 240
		},
		{
			Q: 10000,
			H: 215
		},
		{
			Q: 10813,
			H: 197
		},
		{
			Q: 10500,
			H: 204
		},
		])
	const { coef_a, coef_b } = form.getValues()
	const [coefs, setCoefs] = useState({ a: coef_a, b: coef_b })
	return (
		<Popover modal>
			<PopoverTrigger className='text-sm'>
				Задать расходами
			</PopoverTrigger>
			<PopoverContent side='right' className='w-fit' align='start'>
				<QHChart coefs={coefs} />
				<PumpQHTable data={data} setData={setData} />
				<ABCalculator data={data} form={form} setCoefs={setCoefs} />
			</PopoverContent>
		</Popover>
	)
}

export default PumpCoefsPopover