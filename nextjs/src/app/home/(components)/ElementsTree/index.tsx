import DraggableLayout from '@/components/ui/draggableLayout'
import { FC, useCallback } from 'react'
import { ElementsProps } from '../ElementsBar'
import { ScrollArea } from "@/components/ui/scroll-area"
import TreeList from './TreeList'
import { Button } from '@/components/ui/button'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
const ElementsTree: FC<ElementsProps> = ({ containerRef }) => {
	const { deleteAll, pipeline } = useUnsteadyInputStore(state => state)
	const handleDeleteAll = useCallback(() => {
		deleteAll()
	}, [deleteAll])
	return (
		<DraggableLayout refContainer={containerRef} headerName='Дерево элементов' className='right-5 self-start w-64 h-96 min-w-64' hideable={true} resizable>
			{pipeline.nodes.length !== 0 &&
				<div className='w-full'>
					<Button className='w-full' size={'xsm'} onClick={handleDeleteAll}>Очистить все</Button>
				</div>
			}
			<TreeList />
		</DraggableLayout>
	)
}


export default ElementsTree