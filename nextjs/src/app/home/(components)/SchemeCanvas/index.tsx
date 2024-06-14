
import React, { FC, useEffect, useRef, useState } from 'react'
import DraggableLayout from '@/components/ui/draggableLayout'
import { RefObject } from 'react'
import SCanvas from './3dCanvas/SCanvas'
import OrtoCanvas from './2dCanvas'
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@/components/ui/toggle-group"

export interface ElementsProps {
	containerRef: RefObject<HTMLElement>
}
const SchemeCanvas: FC<ElementsProps> = ({ containerRef }) => {
	const [canvasView, setCanvasView] = useState<'2d' | '3d'>('2d')
	return (
		// <DraggableLayout
		// 	refContainer={containerRef}
		// 	headerName='Схема'
		// 	className='w-[70%] h-[70%] '
		// 	hideable={true}
		// 	resizable={true}
		// 	extraHeaderElement={
		<div className='absolute h-full w-full m-4 rounded border bg-white z-0'>
			<ToggleGroup
				onValueChange={(val: '2d' | '3d') => setCanvasView(val)}
				value={canvasView}
				className='flex font-mono'
				type="single"
				variant={'default'}
				size={'sm'}>
				<ToggleGroupItem value="2d" aria-label="2d">
					<span onClick={() => setCanvasView('2d')}>2d</span>
				</ToggleGroupItem>
				<ToggleGroupItem value="3d" aria-label="3d">
					<span>3d</span>
				</ToggleGroupItem>
			</ToggleGroup>


			<div id='mainCanvas' className='w-full h-full'>
				{
					canvasView == '2d'
						?
						<OrtoCanvas />
						:
						<SCanvas />
				}
			</div>
		</div>
		// </DraggableLayout>
	)
}
export default SchemeCanvas





