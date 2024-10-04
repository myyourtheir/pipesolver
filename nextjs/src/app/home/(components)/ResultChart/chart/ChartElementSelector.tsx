import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { GraphNode } from '@/utils/graph/GraphNode'
import { useSelectedElementsChartContext } from './SelectedElementsChartContext'


function ChartElementSelector() {
	const { chartId, setCharts } = useSelectedElementsChartContext()
	return (
		<Popover>
			<div className='flex justify-between items-center w-full'>
				<PopoverTrigger asChild >
					<Button className='h-8 w-fit self-center p-4 my-3' >
						Выбрать элементы
					</Button>
				</PopoverTrigger>
				<Button onClick={() => {
					setCharts(prev => prev.filter(el => el !== chartId))
				}}>
					-
				</Button>
			</div>
			<PopoverContent side='left' align='start'>
				<ChartElementSlectorContent />
			</PopoverContent>
		</Popover>
	)
}


function ChartElementSlectorContent() {
	const { dispatch } = useSelectedElementsChartContext()
	const { pipeline } = useUnsteadyInputStore()
	return (
		<div className='flex flex-col justify-center items-center'>
			<Button onClick={() => dispatch({ type: 'reset' })} className='self-end h-8 w-fit  p-4 ' >
				Сброс
			</Button>
			<ScrollArea className='w-full h-[320px] mt-2'>
				{
					pipeline.nodes.length !== 0 ? (
						<ul className='space-y-3 mt-1 mb-2 mr-2 w-full'>
							{
								pipeline.nodes.map((element, idx) => (
									<ChartElementSlectorContentItem element={element} key={element.id} />
								))
							}
						</ul>
					) : (
						<span className='flex justify-center'>
							Добавьте элементы
						</span>
					)
				}
			</ScrollArea>
		</div>
	)
}

type ChartElementSlectorContentItemProps = {
	element: GraphNode,
}
function ChartElementSlectorContentItem({ element }: ChartElementSlectorContentItemProps) {
	const { state: { resultSelectedElementIds }, dispatch } = useSelectedElementsChartContext()
	const handleClick = () => {
		if (resultSelectedElementIds.includes(element.id)) {
			dispatch({ type: 'remove', value: element.id })
		} else {
			dispatch({ type: 'add', value: element.id })
		}
	}
	const order = resultSelectedElementIds.indexOf(element.id)
	return (
		<li className='flex w-full justify-between' onClick={handleClick}>
			{
				order !== -1 && <span className='justify-self-start'>{order + 1}</span>
			}

			{element.name}

		</li>
	)
}

export default ChartElementSelector