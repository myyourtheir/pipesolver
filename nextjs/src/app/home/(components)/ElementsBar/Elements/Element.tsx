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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { FC, createContext, useState } from 'react'
interface ElementProps {
	TriggerContent: any,
	hoverTitle: string
	children: React.ReactNode
}
export type ElementContextType = {
	setOpen: (c: boolean) => void
}

export const ElementContext = createContext<ElementContextType>({ setOpen: () => { } })

const Element: FC<ElementProps> = ({ TriggerContent, children, hoverTitle }) => {
	const [open, setOpen] = useState(false)
	return (
		<ElementContext.Provider value={{ setOpen }}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger className=''>
					<HoverCard openDelay={100} closeDelay={100}>
						<HoverCardTrigger>
							<TriggerContent />
						</HoverCardTrigger>
						<HoverCardContent className='w-fit h-fit text-sm text-[#F5F5F5] p-1 bg-[#333333] border-none shadow-none' side='left' align='start'>
							{hoverTitle}
						</HoverCardContent>
					</HoverCard>
					{/* <TooltipProvider>
						<Tooltip >
							<TooltipTrigger asChild>
								<TriggerContent />
							</TooltipTrigger >
							<TooltipContent asChild>
								{hoverTitle}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider> */}
				</PopoverTrigger>
				<PopoverContent side='right'>
					{children}
				</PopoverContent>
			</Popover>
		</ElementContext.Provider>
	)
}

export default Element



