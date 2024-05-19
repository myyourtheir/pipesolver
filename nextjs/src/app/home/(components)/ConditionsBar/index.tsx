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
		<DraggableLayout refContainer={containerRef} className='left-auto top-4 bottom-full' headerName='Свойства жидкости'>
			<ConditionsContent defaultValues={cond_params} onSubmit={updateCondParams} />
		</DraggableLayout>
	)
}

export default ConditionsBar;






