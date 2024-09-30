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


interface ElementProps {
	TriggerContent: any,
	isHover?: boolean
	hoverTitle?: string
	children: React.ReactNode
}

export type ElementContextType = {
	setOpen: (c: boolean) => void
}

export const ElementContext = createContext<ElementContextType>({ setOpen: () => { } })

const Element: FC<ElementProps> = ({ TriggerContent, children, hoverTitle, isHover = true }) => {
	const [open, setOpen] = useState(false)
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
					<PopoverTrigger>
						<ContextMenuTrigger >
							{
								isHover ?
									<HoverCard openDelay={100} closeDelay={100}>
										<HoverCardTrigger >
											<TriggerContent />
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
			{/* <Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger className='disabled:cursor-not-allowed'>
					{
						isHover ?
							<HoverCard openDelay={100} closeDelay={100}>
								<HoverCardTrigger >
									<TriggerContent />
								</HoverCardTrigger>
								<HoverCardContent className=' w-fit py-0 px-1 text-xs text-[#F5F5F5]  bg-[#333333] border-none shadow-none h-fit' side='bottom' align='center'>
									{hoverTitle}
								</HoverCardContent>
							</HoverCard>
							: <TriggerContent />
					}
				</PopoverTrigger>
				<PopoverContent side='right'>
					{children}
				</PopoverContent>
			</Popover> */}
		</ElementContext.Provider>
	)
}

export default Element



