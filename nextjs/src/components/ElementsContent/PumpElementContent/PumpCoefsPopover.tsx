import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import QHList from './QHList'
import PumpQHTable from './QHTable'
import { useState } from 'react'



const PumpCoefsPopover = () => {
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
	return (
		<Popover>
			<PopoverTrigger className='text-sm'>
				Задать расходами
			</PopoverTrigger>
			<PopoverContent side='right' className='w-fit' align='start'>
				<PumpQHTable data={data} />
			</PopoverContent>
		</Popover>
	)
}

export default PumpCoefsPopover