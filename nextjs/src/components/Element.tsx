'use client'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card"
import { FC, createContext, useState } from 'react'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { ElementParamsUnion } from '../../types/stateTypes'
import { useSelectedElementModeContext } from '@/app/home/(contexts)/useSelectedElementMode'
import { usePipeElementContext } from '@/app/home/(contexts)/useNewPipeElementContext'


interface ElementProps {
	TriggerContent: any,
	isHover?: boolean
	hoverTitle?: string
	children?: React.ReactNode,
	elementType: ElementParamsUnion['type']
}

export type ElementContextType = {
	setOpen: (c: boolean) => void
}

export const ElementContext = createContext<ElementContextType>({ setOpen: () => { } })

const Element: FC<ElementProps> = ({ TriggerContent, children, hoverTitle, isHover = true, elementType }) => {
	const [open, setOpen] = useState(false)
	const { elementModeDispatch, elementModeState } = useSelectedElementModeContext()
	const { dispatch } = usePipeElementContext()
	const handleElementClick = () => {
		elementModeDispatch({ type: 'setModeElement', value: elementType })
		if (elementType === 'pipe') {
			dispatch({ type: 'resetParentElement' })
		}
	}

	if (!children) {
		return (
			<>
				{
					isHover ?
						<HoverCard openDelay={100} closeDelay={100}>
							<HoverCardTrigger
								onClick={handleElementClick}
							>
								<div
									className={`
										w-full h-full flex items-center justify-center hover:ring-1 hover:ring-ring rounded-sm 
										${elementModeState.modeElement === elementType && 'shadow-inner-md bg-zinc-100'} 
									`}
								>
									<TriggerContent />
								</div>
							</HoverCardTrigger>
							<HoverCardContent className=' w-fit py-0 px-1 text-xs text-[#F5F5F5]  bg-[#333333] border-none shadow-none h-fit' side='bottom' align='center'>
								{hoverTitle}
							</HoverCardContent>
						</HoverCard>
						: <TriggerContent />
				}
			</>
		)
	}

	return (
		<ElementContext.Provider value={{ setOpen }}>
			<Popover
				open={open}
				onOpenChange={(val) => {
					if (val === false) {
						setOpen(false)
					}
				}}
				modal={true}
			>

				<ContextMenu modal={true}>
					<PopoverTrigger >
						<ContextMenuTrigger >
							{
								isHover ?
									<HoverCard openDelay={100} closeDelay={100}>
										<HoverCardTrigger
											onClick={handleElementClick}
										>
											<div
												className={`
														w-full h-full flex items-center justify-center hover:ring-1 hover:ring-ring rounded-sm 
														${elementModeState.modeElement === elementType && 'shadow-inner-md bg-zinc-100'} 
													`}
											>
												<TriggerContent />
											</div>
										</HoverCardTrigger>
										<HoverCardContent className=' w-fit py-0 px-1 text-xs text-[#F5F5F5]  bg-[#333333] border-none shadow-none h-fit' side='bottom' align='center'>
											{hoverTitle}
										</HoverCardContent>
									</HoverCard>
									: <TriggerContent />
							}
						</ContextMenuTrigger>
					</PopoverTrigger>
					<ContextMenuContent>
						<ContextMenuItem onClick={() => setOpen(true)}>Параметры по умолчанию</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>
				<PopoverContent side='bottom'>
					{children}
				</PopoverContent>

			</Popover>
		</ElementContext.Provider>
	)
}

export default Element



