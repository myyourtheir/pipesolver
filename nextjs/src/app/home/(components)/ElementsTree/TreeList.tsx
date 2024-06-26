import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import React, { FC, ReactElement, memo, useMemo } from 'react'
import { ElementParamsUnion, ElementsType, UnsteadyInputData } from '../../../../../types/stateTypes'
import TreeItemContextMenu from './TreeItemContextMenu'
import { ScrollArea } from '@/components/ui/scroll-area'
import PipeElementContent from '@/components/ElementsContent/PipeElementContent'
import ProviderElementContent from '@/components/ElementsContent/ProviderElementContent'
import ConsumerElementContent from '@/components/ElementsContent/ConsumerElementContent'
import PumpElementContent from '@/components/ElementsContent/PumpElementContent'

import GateValveElementContent from '@/components/ElementsContent/GateValveElementContent'
import SafeValveElementContent from '@/components/ElementsContent/SafeValveElementContent'
import { ElementContentType } from '@/components/ElementsContent/ContentType'

const TypeToTitles: Record<ElementsType, { title: string, form: FC<ElementContentType> }> = {
	pipe: {
		title: 'Труба',
		form: (props) => <PipeElementContent {...props} />
	},
	pump: {
		title: 'Насос',
		form: (props) => <PumpElementContent {...props} />
	},
	consumer: {
		title: 'Потребитель',
		form: (props) => <ConsumerElementContent {...props} />
	},
	provider: {
		title: 'Поставщик',
		form: (props) => <ProviderElementContent {...props} />
	},
	gate_valve: {
		title: 'Задвижка',
		form: (props) => <GateValveElementContent {...props} />
	},
	safe_valve: {
		title: 'Клапан',
		form: (props) => <SafeValveElementContent {...props} />
	}
}

const TreeList = () => {
	const { pipeline, setIsSelected } = useUnsteadyInputStore(state => state)
	const { updateElement } = useUnsteadyInputStore(state => state)
	return (
		<ScrollArea className='w-full h-full mt-2'>
			{
				pipeline.nodes.length !== 0 ? (
					<ul className='space-y-1 mt-1'>
						{
							pipeline.nodes.map((element, idx) => (
								<TreeItemContextMenu
									key={idx}
									className={`${element.value.uiConfig.selected ? 'border-purple-700 border-1' : 'border-0'}`}
									element={element.value}
									idx={idx}
									trigger={<TreeItem element={element.value} onClick={() => setIsSelected(idx)} />}
								>
									{
										TypeToTitles[element.value.type].form({
											defaultValues: element.value,
											submitButtonTitle: "Изменить",
											onSubmit: (values) => { updateElement(values, idx) }
										})
									}
								</TreeItemContextMenu>
							))
						}
					</ul>
				) : (
					<span className='flex justify-center'>
						Добавьте элементы
					</span>
				)
			}
		</ScrollArea>
	)
}

export default TreeList


export interface TreeItemProps {
	element: ElementParamsUnion,
	onClick?: () => void
}

const TreeItem: FC<TreeItemProps> = ({ element, onClick }) => {

	return (
		<li onClick={onClick} className='text-sm hover:ring-1 hover:ring-ring rounded-md w-full'>
			{TypeToTitles[element.type].title}
		</li>
	)
}

