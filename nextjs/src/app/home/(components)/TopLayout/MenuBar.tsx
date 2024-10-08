import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "@/components/ui/menubar"
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import useHandleFileSave from './useHadleFileSave'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dispatch, SetStateAction, useState } from 'react'



function TopMenuBar() {
	const { handleGetFileFromPC } = useHandleFileSave()
	const [saveContentOpen, setSaveContentOpen] = useState(false)
	return (

		<Menubar className='rounded-none bg-inherit'>
			<MenubarMenu>
				<MenubarTrigger>
					Файл
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem
						onClick={e => handleGetFileFromPC()}
					>
						Загрузить
					</MenubarItem >
					<MenubarItem asChild>
						<Dialog open={saveContentOpen} onOpenChange={setSaveContentOpen}>
							<DialogTrigger
								className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full hover:bg-muted "
							>
								Сохранить
							</DialogTrigger>
							<SaveFormContent setOpen={setSaveContentOpen} />
						</Dialog>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>

	)
}

export default TopMenuBar

type SaveFormContentProps = {
	setOpen: Dispatch<SetStateAction<boolean>>
}

const SaveFormContent = ({ setOpen }: SaveFormContentProps) => {
	const { pipeline, cond_params } = useUnsteadyInputStore()
	const { handleSaveToPC, setTitle, title } = useHandleFileSave()
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Это сохранит схему на ваше устройство</DialogTitle>
				<DialogDescription>
					Укажите название файла
				</DialogDescription>
			</DialogHeader>
			<form onSubmit={() => {
				setOpen(false)
				handleSaveToPC(
					{
						data: {
							cond_params,
							pipeline: pipeline.toObj()
						}
					}
				)
			}
			}>
				<Input
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<Button type='submit'>
					Сохранить
				</Button>
			</form>
		</DialogContent>
	)
}