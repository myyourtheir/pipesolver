import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import PumpQHTable from './QHTable'
import { FC, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import QHChart from './QHChart'
import { Badge } from '@/components/ui/badge'
import calculatePumpAB from './QHTable/calculatePumpAB'
import ABFormSetter from './QHTable/ABFormSetter'

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
	const { a, b } = calculatePumpAB(data)
	const [coefs, setCoefs] = useState({ a: a, b: b })
	useEffect(() => {
		setCoefs({
			a, b
		})
	}, [a, b])
	return (
		<Popover modal>
			<PopoverTrigger className='text-sm '>
				<Badge variant={'outline'} className='bg-gray-50 hover:bg-[rgba(52,_62,_64,_0.1)]	'>
					Рассчитать параметры
				</Badge>
			</PopoverTrigger>
			<PopoverContent side='right' className='w-fit' align='start'>
				<QHChart tableData={data} coefs={coefs} />
				<PumpQHTable data={data} setData={setData} />
				<ABFormSetter coefs={coefs} form={form} />
			</PopoverContent>
		</Popover>
	)
}

export default PumpCoefsPopover