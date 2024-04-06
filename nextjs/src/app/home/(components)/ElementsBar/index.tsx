

import DraggableLayout from '@/components/ui/draggableLayout'
import { FC, RefObject } from 'react'
import ElementsList from './ElementsList'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'

interface ElementsProps {
	containerRef: RefObject<HTMLElement>
}

const ElementsBar: FC<ElementsProps> = ({ containerRef }) => {

	const pipeline = useUnsteadyInputStore(state => state.pipeline)
	console.log(pipeline)
	return (
		<DraggableLayout refContainer={containerRef} headerName='Элементы' className='left-5 w-fit '>
			<ElementsList />
		</DraggableLayout>
	)
}

export default ElementsBar;






