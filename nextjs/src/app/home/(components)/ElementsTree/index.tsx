import DraggableLayout from '@/components/ui/draggableLayout'
import { FC, useCallback } from 'react'
import { ElementsProps } from '../ElementsBar'
import { ScrollArea } from "@/components/ui/scroll-area"
import TreeList from './TreeList'
import { Button } from '@/components/ui/button'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { useResultsStore } from '@/lib/globalStore/resultsStore'
const ElementsTree: FC<ElementsProps> = ({ containerRef, open, toggleOpen }) => {
	const { deleteAll, pipeline } = useUnsteadyInputStore(state => state)
	const { resetResult } = useResultsStore()
	const handleDeleteAll = useCallback(() => {
		deleteAll()
		resetResult()
	}, [deleteAll, resetResult])
	return (
		<DraggableLayout open={open} toggleOpen={toggleOpen} refContainer={containerRef} headerName='Дерево элементов' className='right-5 top-10  self-start w-64 h-96 min-w-64' hideable={true}>
			<section className='h-full'>
				{pipeline.nodes.length !== 0 &&
					<Button className='w-full' size={'xsm'} onClick={handleDeleteAll}>Удалить все элементы</Button>
				}
				<TreeList />
			</section>
		</DraggableLayout>
	)
}


export default ElementsTree