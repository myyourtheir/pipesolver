

import DraggableLayout from '@/components/ui/draggableLayout'
import { FC, RefObject } from 'react'
import ElementsList from './ElementsList'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'

export interface ElementsProps {
	containerRef: RefObject<HTMLElement>
}

const ElementsBar: FC<ElementsProps> = ({ containerRef }) => {


	return (
		<DraggableLayout refContainer={containerRef} headerName='Элементы' className='left-5 w-fit self-start'>
			<ElementsList />
		</DraggableLayout>
	)
}

export default ElementsBar;






