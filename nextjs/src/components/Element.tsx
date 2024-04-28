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
interface ElementProps {
	TriggerContent: any,
	isHover?: boolean
	hoverTitle?: string
	children: React.ReactNode
	disabled: boolean,

}
export type ElementContextType = {
	setOpen: (c: boolean) => void
}

export const ElementContext = createContext<ElementContextType>({ setOpen: () => { } })

const Element: FC<ElementProps> = ({ TriggerContent, children, hoverTitle, disabled, isHover = true }) => {
	const [open, setOpen] = useState(false)
	return (
		<ElementContext.Provider value={{ setOpen }}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger className={`disabled:cursor-not-allowed`} disabled={disabled}>
					{
						isHover ?
							<HoverCard openDelay={100} closeDelay={100}>
								<HoverCardTrigger>
									<TriggerContent />
								</HoverCardTrigger>
								<HoverCardContent className='w-fit h-fit text-sm text-[#F5F5F5] p-1 bg-[#333333] border-none shadow-none' side='left' align='start'>
									{hoverTitle}
								</HoverCardContent>
							</HoverCard>
							: <TriggerContent />
					}
				</PopoverTrigger>
				<PopoverContent side='right'>
					{children}
				</PopoverContent>
			</Popover>
		</ElementContext.Provider>
	)
}

export default Element



