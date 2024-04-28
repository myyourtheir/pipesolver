'use client'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import React, { FC, ReactNode, useState } from 'react'
import { TreeItemProps } from './TreeList'
import { toast } from 'sonner'
import { ElementContext } from '@/components/Element'

interface ContextProps extends TreeItemProps {
	children: ReactNode,
	className: string,
	idx: number,
	trigger: JSX.Element
}

const TreeItemContextMenu: FC<ContextProps> = ({ children, idx, element, className, trigger }) => {
	const { deleteElement, pipeline } = useUnsteadyInputStore(state => state)
	const hanldeDelete = () => {
		if (pipeline.length > 1 && element.type === 'provider') {
			toast.warning("Невозможно удалить поставщика")
		} else {
			deleteElement(idx)
		}
	}
	const [popoverOpen, setPopoverOpen] = useState(false)
	return (
		<ElementContext.Provider value={{ setOpen: setPopoverOpen }}>
			<Popover
				open={popoverOpen}
				onOpenChange={(val) => {
					console.log(val)
					if (val === false) {
						setPopoverOpen(false)
					}
				}}
			>

				<ContextMenu>
					<PopoverTrigger
						onDoubleClick={(e) => {
							console.log(e)
							setPopoverOpen(true)
						}}
						className={`w-full flex items-center justify-center bg-red ${className}`}
					>

						<ContextMenuTrigger >
							{trigger}
						</ContextMenuTrigger>
					</PopoverTrigger>
					<ContextMenuContent>
						<ContextMenuItem onClick={() => setPopoverOpen(true)}>Параметры</ContextMenuItem>
						<ContextMenuItem onClick={hanldeDelete}>Удалить</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>
				{window.screen.availWidth >= 768
					?
					<PopoverContent side='left'>
						{children}
					</PopoverContent>
					:
					<PopoverContent side='bottom'>
						{children}
					</PopoverContent>
				}
			</Popover>
		</ElementContext.Provider>
	)
}


export default TreeItemContextMenu