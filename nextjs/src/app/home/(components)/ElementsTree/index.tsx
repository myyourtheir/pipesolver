import DraggableLayout from '@/components/ui/draggableLayout'
import { FC } from 'react'
import { ElementsProps } from '../ElementsBar'
import { ScrollArea } from "@/components/ui/scroll-area"
import TreeList from './TreeList'
import { Button } from '@/components/ui/button'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
const ElementsTree: FC<ElementsProps> = ({ containerRef }) => {
	const { deleteAll, pipeline } = useUnsteadyInputStore(state => state)
	const handleDeleteAll = () => {
		deleteAll()
	}
	return (
		<DraggableLayout refContainer={containerRef} headerName='Дерево элементов' className='right-5 self-start w-64 h-96' hideable={true}>
			<ScrollArea className='flex flex-col gap-6'>
				{pipeline.length !== 0 &&
					<div className='w-full'>
						<Button className='w-full' size={'xsm'} onClick={handleDeleteAll}>Очистить все</Button>
					</div>
				}
				<TreeList />
			</ScrollArea>
		</DraggableLayout>
	)
}


export default ElementsTree