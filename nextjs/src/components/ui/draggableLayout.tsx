'use client'

import { useDraggable } from '@/utils/useDraggable'
import { GripHorizontal, Maximize2 } from 'lucide-react'
import { FC, RefObject, useRef, useState } from 'react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'

interface DraggableLayoutProps {
	refContainer: RefObject<HTMLElement>,
	children: React.ReactNode,
	className?: string,
	headerName: string
}

const DraggableLayout: FC<DraggableLayoutProps> = ({ refContainer, children, headerName, className }) => {
	const toolBarRef = useRef(null)
	const toolBarHeaderRef = useRef(null)
	const [isOpen, setIsOpen] = useState(true)

	useDraggable({ refEventsElement: toolBarHeaderRef, refTransformElement: toolBarRef, refContainer })

	return (
		<Card ref={toolBarRef} className={`absolute h-fit w-fit rounded-md border bg-white ${className}`}>
			<CardHeader
				className='flex-row justify-between items-center border-b p-0  gap-4 space-y-0 m-1'
			>
				<GripHorizontal ref={toolBarHeaderRef} className='cursor-pointer ml-1' size={15} />
				<CardTitle className='whitespace-nowrap'>
					{headerName}
				</CardTitle>
				<Button
					variant={'outline'}
					className='border-none my-1 mr-1'
					size={'xsm'}
					onClick={() => setIsOpen(prev => !prev)}
				>
					{
						isOpen
							? '-'
							: <Maximize2 size={14} />
					}
				</Button>
			</CardHeader>
			<CardContent className={`${isOpen ? 'p-1' : 'p-0'}`}>
				{isOpen &&
					children
				}
			</CardContent>
		</Card>
	)
}

export default DraggableLayout