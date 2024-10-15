'use client'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useBlockDisplayStore } from '@/lib/globalStore/blockDisplayStore'
import { CopyPlus, Droplets, LineChart, Network } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'


function BarsOpenController() {
	const ref = useRef<HTMLDivElement | null>(null)
	const openController = useBlockDisplayStore()
	const [open, setOpen] = useState(false)

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		document.addEventListener('mousedown', handleOutsideClick)
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick)
		}
	}, [ref])

	return (
		<div
			className='relative'
			ref={ref}
		>
			<Button size={'sm'}
				className='sm:hidden' variant={'outline'}
				onClick={(e) => {
					e.stopPropagation()
					setOpen(prev => !prev)
				}
				}>
				М
			</Button>
			<aside
				className={`flex flex-col absolute  z-50 gap-2 items-center bg-white p-2 rounded-md shadow-md ${!open && 'hidden'} sm:flex sm:static  sm:flex-row sm:bg-inherit sm:shadow-none`}
			>
				<BarsOpenElement
					hoverContent={
						'Элементы'
					}
					open={openController.elementsBarDisplay}
					toggle={openController.toggleElementsBar}
					trigger={<CopyPlus size={20} />}
				/>
				<BarsOpenElement
					hoverContent={
						'Свойства жидкости'
					}
					open={openController.conditionsBarDisplay}
					toggle={openController.toggleConditionsBar}
					trigger={<Droplets size={20} />}
				/>
				<BarsOpenElement
					hoverContent={
						'Дерево элементов'
					}
					open={openController.elementsTreeDisplay}
					toggle={openController.toggleElementsTree}
					trigger={<Network size={20} />}
				/>
				<BarsOpenElement
					hoverContent={
						'Резульаты расчета'
					}
					open={openController.resultChartDisplay}
					toggle={openController.toggleResultChart}
					trigger={<LineChart size={20} />}
				/>
			</aside>
		</div>
	)
}

export default BarsOpenController



type BarsOpenElementsProps = {
	toggle: () => void,
	open: boolean,
	trigger: React.ReactNode,
	hoverContent: React.ReactNode
}

const BarsOpenElement = ({ toggle, open, trigger, hoverContent }: BarsOpenElementsProps) => {
	return (
		<TooltipProvider delayDuration={100}>
			<Tooltip >
				<TooltipTrigger asChild >
					<Button
						variant={'outline'}
						className={`${open ? 'shadow-inner bg-zinc-200 hover:bg-zinc-200' : 'bg-white'} `}
						onClick={toggle}
					>
						{trigger}
					</Button>
				</TooltipTrigger>
				<TooltipContent side='bottom'>
					{hoverContent}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>

	)
}