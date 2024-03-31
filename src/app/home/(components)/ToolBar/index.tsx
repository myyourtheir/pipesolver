'use client'

import DraggableLayout from '@/components/ui/draggableLayout'
import { FC, RefObject } from 'react'

interface ToolbarProps {
	containerRef: RefObject<HTMLElement>
}

const ToolBar: FC<ToolbarProps> = ({ containerRef }) => {


	return (
		<DraggableLayout refContainer={containerRef} headerName='Элементы'>
			Панель компонентов трубы
		</DraggableLayout>
	)
}

export default ToolBar;






