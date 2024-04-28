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
import React, { FC, useState } from 'react'
import { TreeItemProps } from './TreeList'
import { toast } from 'sonner'

interface ContextProps extends TreeItemProps {
	children: React.ReactNode,
	className: string,
	idx: number,
}

const TreeItemContextMenu: FC<ContextProps> = ({ children, idx, element, className }) => {
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
						{children}
					</ContextMenuTrigger>
				</PopoverTrigger>
				<ContextMenuContent>
					<ContextMenuItem onClick={() => setPopoverOpen(true)}>Параметры</ContextMenuItem>
					<ContextMenuItem onClick={hanldeDelete}>Удалить</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
			<PopoverContent side='left'>
				GHbdtn
			</PopoverContent>
		</Popover>
	)
}


export default TreeItemContextMenu