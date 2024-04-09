
import React, { FC, useEffect, useRef } from 'react'
import DraggableLayout from '@/components/ui/draggableLayout'
import { RefObject } from 'react'

import SCanvas from './SCanvas'

export interface ElementsProps {
	containerRef: RefObject<HTMLElement>
}
const SchemeCanvas: FC<ElementsProps> = ({ containerRef }) => {
	return (
		<DraggableLayout refContainer={containerRef} headerName='Схема' className='w-[70%] h-[70%] ' hideable={false}>
			<SCanvas />
		</DraggableLayout>
	)
}
export default SchemeCanvas





