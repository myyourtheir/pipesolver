'use client'

import DraggableLayout from '@/components/ui/draggableLayout'
import { FC, RefObject } from 'react'

interface ConditionsBarProps {
	containerRef: RefObject<HTMLElement>
}

const ConditionsBar: FC<ConditionsBarProps> = ({ containerRef }) => {


	return (
		<DraggableLayout refContainer={containerRef} className='right-1' headerName='Окружающие условия'>
			Условия работы
		</DraggableLayout>
	)
}

export default ConditionsBar;






