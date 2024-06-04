import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FC } from 'react'

interface Props {

	children: React.ReactNode

}

const ElementContextMenu: FC<Props> = ({ children }) => {
	return (
		<Popover>
			<PopoverTrigger>
				{children}
			</PopoverTrigger>
			<PopoverContent>
				прИВЕТ
			</PopoverContent>
		</Popover>
	)
}

export default ElementContextMenu