import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "@/components/ui/menubar"
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import useHandleFileSave from './useHadleFileSave'




function TopMenuBar() {
	const { pipeline, cond_params } = useUnsteadyInputStore()
	const { handleGetFileFromPC, handleSaveToPC } = useHandleFileSave()
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
					</MenubarItem>
					<MenubarItem
						onClick={() => handleSaveToPC(
							{
								data: {
									cond_params,
									pipeline: pipeline.toObj()
								}
							},
							`Схема от ${new Date().toLocaleString()}`
						)}
					>
						Сохранить
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>

	)
}

export default TopMenuBar