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

interface ContextProps extends Omit<TreeItemProps, 'isSelected'> {
	children: ReactNode,
	className: string,
	idx: number,
	trigger: JSX.Element
}

const TreeItemContextMenu: FC<ContextProps> = ({ children, idx, element, className, trigger }) => {
	const { deleteElement, pipeline } = useUnsteadyInputStore(state => state)
	const hanldeDelete = () => {
		if (pipeline.nodes.length > 1 && element.type === 'provider') {
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
					if (val === false) {
						setPopoverOpen(false)
					}
				}}
				modal={true}
			>

				<ContextMenu modal={true}>
					<PopoverTrigger
						onDoubleClick={(e) => {
							setPopoverOpen(true)
						}}
						className={`w-full px-1 bg-red ${className}`}
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
				<PopoverContent side='bottom'>
					{children}
				</PopoverContent>
			</Popover>
		</ElementContext.Provider>
	)
}


export default TreeItemContextMenu