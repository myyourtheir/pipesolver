import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import React, { FC } from 'react'
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
	return (
		<ContextMenu>
			<ContextMenuTrigger className={`w-full flex items-center justify-center bg-red ${className}`}>
				{children}
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuItem onClick={hanldeDelete}>Удалить</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	)
}


export default TreeItemContextMenu