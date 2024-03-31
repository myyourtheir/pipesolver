'use client'

import { useDraggable } from '@/utils/useDraggable'
import { GripHorizontal, Maximize2 } from 'lucide-react'
import { FC, RefObject, useRef, useState } from 'react'
import { Button } from './button'

interface DraggableLayoutProps {
	refContainer: RefObject<HTMLElement>,
	children: React.ReactNode,
	className?: string,
	headerName: string
}

const DraggableLayout: FC<DraggableLayoutProps> = ({ refContainer, children, headerName, className = 'left-1' }) => {
	const toolBarRef = useRef(null)
	const toolBarHeaderRef = useRef(null)
	const [isOpen, setIsOpen] = useState(true)

	useDraggable({ refEventsElement: toolBarHeaderRef, refTransformElement: toolBarRef, refContainer })

	return (
		<aside ref={toolBarRef} className={`absolute h-fit w-fit rounded-md border bg-white ${className}`}>
			<div

				className='flex justify-between items-center border-b  gap-4 '
			>
				<GripHorizontal ref={toolBarHeaderRef} className='cursor-pointer ml-1' size={15} />
				<span className='whitespace-nowrap'>
					{headerName}
				</span>
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
			</div>

			{isOpen &&
				children
			}
		</aside>
	)
}

export default DraggableLayout