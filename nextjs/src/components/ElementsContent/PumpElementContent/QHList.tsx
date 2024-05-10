import { useRef, useState } from 'react'
import QHItem from './QHItem'

const QHList = () => {
	const QHStore = useRef([
		{
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

		<div className='space-y-1'>
			<div className='grid grid-cols-2'>
				<span>
					Q
				</span>
				<span>
					H
				</span>
			</div>
			{QHStore.current.map((QH, i) => {
				return <QHItem key={`${i}${QH.H}${QH.Q}`} Q={QH.Q} H={QH.H} index={i} data={QHStore.current} />
			})}
		</div>

	)
}

export default QHList