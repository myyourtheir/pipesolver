'use client'

import DraggableLayout from '@/components/ui/draggableLayout'
import { FC, RefObject } from 'react'
import ConditionsContent from './ConditionsContent'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { ElementsProps } from '../ElementsBar'


const ConditionsBar: FC<ElementsProps> = ({ containerRef, open, toggleOpen }) => {

	const { cond_params, updateCondParams } = useUnsteadyInputStore(state => state)
	return (
		<DraggableLayout open={open} toggleOpen={toggleOpen} refContainer={containerRef} className='left-auto top-10 bottom-full' headerName='Свойства жидкости'>
			<section>
				<ConditionsContent defaultValues={cond_params} onSubmit={updateCondParams} />
			</section>
		</DraggableLayout>
	)
}

export default ConditionsBar;






