'use client'


import { GripHorizontal, Maximize2, Weight } from 'lucide-react'
import { FC, RefObject, useEffect, useRef, useState } from 'react'
import { Button } from './button'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { useDraggable } from '@/utils/hooks/useDraggable'

interface DraggableLayoutProps {
	refContainer: RefObject<HTMLElement>,
	children: React.ReactNode,
	className?: string,
	headerName: string,
	extraHeaderElement?: React.ReactNode
	hideable?: boolean,
	defaultState?: boolean,
	resizable?: boolean,
}

const DraggableLayout: FC<DraggableLayoutProps> = ({ refContainer, children, extraHeaderElement, headerName, className, hideable = true, defaultState = true, resizable = false, }) => {
	const toolBarRef = useRef<HTMLDivElement>(null)
	const toolBarHeaderRef = useRef(null)
	const HeaderRef = useRef<HTMLDivElement>(null)
	const lastSize = useRef<{ height: string; width: string }>({ height: '0px', width: '0px' })
	useEffect(() => {
		if (toolBarRef.current)
			lastSize.current = {
				height: `${toolBarRef.current.style.height}px`,
				width: `${toolBarRef.current.style.width}px`
			}
	}, [])
	const [isOpen, setIsOpen] = useState(defaultState)

	useDraggable({ refEventsElement: toolBarHeaderRef, refTransformElement: toolBarRef, refContainer, })

	return (
		<Card ref={toolBarRef} className={`absolute h-fit w-fit rounded-md border bg-white   ${className}  ${resizable && isOpen ? 'resize overflow-hidden' : 'resize-none'} ${isOpen ? 'p-1' : 'p-0 w-fit h-fit'}`}>
			<CardHeader
				className='flex-row justify-between items-center border-b p-0  gap-4 space-y-0 pb-1'
				ref={HeaderRef}
			>
				<GripHorizontal ref={toolBarHeaderRef} className='cursor-pointer ml-1 touch-none' size={15} />
				<CardTitle className='whitespace-nowrap text-base'>
					{headerName}
				</CardTitle>
				{
					extraHeaderElement
				}
				{hideable ?
					<Button
						variant={'outline'}
						className='border-none my-1 mr-1'
						size={'xsm'}
						onClick={() => {
							if (toolBarRef.current) {
								if (isOpen) {
									lastSize.current = {
										height: `${toolBarRef.current.style.height}`,
										width: `${toolBarRef.current.style.width}`
									}
									toolBarRef.current.style.height = `${HeaderRef.current?.clientHeight}px`
									toolBarRef.current.style.width = `${HeaderRef.current?.clientWidth}px`
								} else {
									toolBarRef.current.style.height = lastSize.current.height
									toolBarRef.current.style.width = lastSize.current.width
								}
							}
							setIsOpen(prev => !prev)
						}
						}
					>
						{
							isOpen
								? '-'
								: <Maximize2 size={14} />
						}
					</Button> :
					<>
					</>
				}
			</CardHeader>
			<CardContent className={` w-full h-[calc(100%-1em-8px)] ${isOpen ? 'p-1' : 'hidden p-0 w-0 h-0'}`}>
				{isOpen &&
					children
				}
			</CardContent>
		</Card>
	)
}

export default DraggableLayout