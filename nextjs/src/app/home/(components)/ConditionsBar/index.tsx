'use client'

import DraggableLayout from '@/components/ui/draggableLayout'
import { FC, RefObject } from 'react'
import ConditionsContent from './ConditionsContent'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'

interface ConditionsBarProps {
	containerRef: RefObject<HTMLElement>
}

const ConditionsBar: FC<ConditionsBarProps> = ({ containerRef }) => {

	const { cond_params, updateCondParams } = useUnsteadyInputStore(state => state)
	return (
		<DraggableLayout refContainer={containerRef} className='left-auto top-10 bottom-full' headerName='Свойства жидкости'>
			<section>
				<ConditionsContent defaultValues={cond_params} onSubmit={updateCondParams} />
			</section>
		</DraggableLayout>
	)
}

export default ConditionsBar;






