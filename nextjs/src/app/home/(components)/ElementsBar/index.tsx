

import DraggableLayout from '@/components/ui/draggableLayout'
import { FC, RefObject } from 'react'
import ElementsList from './ElementsList'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'

export interface ElementsProps {
	containerRef: RefObject<HTMLElement>,
	open: boolean,
	toggleOpen: () => void
}

const ElementsBar: FC<ElementsProps> = ({ containerRef, open, toggleOpen }) => {


	return (
		<DraggableLayout open={open} toggleOpen={toggleOpen} refContainer={containerRef} headerName='Элементы' className='left-5 top-10  w-fit self-start'>
			<section>
				<ElementsList />
			</section>
		</DraggableLayout>
	)
}

export default ElementsBar;






