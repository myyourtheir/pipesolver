import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useBlockDisplayStore } from '@/lib/globalStore/blockDisplayStore'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@radix-ui/react-hover-card'
import { CopyPlus, Droplets, LineChart, Network } from 'lucide-react'
import React from 'react'


function BarsOpenController() {
	const openController = useBlockDisplayStore()

	return (
		<aside className='flex gap-2 items-center mx-4' >
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
				<TooltipTrigger asChild>
					<Button
						variant={'outline'}
						className={`${open ? 'shadow-inner bg-zinc-200 hover:bg-zinc-200' : 'bg-white'} `}
						onClick={toggle}
					>
						{trigger}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					{hoverContent}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>

	)
}