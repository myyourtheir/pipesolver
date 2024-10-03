'use client'
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
import { GraphNode } from '@/utils/graph/GraphNode'

const TypeToTitles: Record<ElementsType, { form?: FC<ElementContentType> }> = {
	pipe: {
		form: (props) => <PipeElementContent {...props} />
	},
	pump: {
		form: (props) => <PumpElementContent {...props} />
	},
	consumer: {
		form: (props) => <ConsumerElementContent {...props} />
	},
	provider: {
		form: (props) => <ProviderElementContent {...props} />
	},
	gate_valve: {
		form: (props) => <GateValveElementContent {...props} />
	},
	safe_valve: {
		form: (props) => <SafeValveElementContent {...props} />
	},
	tee: {
	}
}

const TreeList = () => {
	const { pipeline, setIsSelected } = useUnsteadyInputStore(state => state)
	const { updateElement } = useUnsteadyInputStore(state => state)

	return (
		<ScrollArea className='w-full h-[320px] mt-2'>
			{
				pipeline.nodes.length !== 0 ? (
					<ul className='space-y-1 mt-1 mb-2 mr-2'>
						{
							pipeline.nodes.map((element, idx) => (
								<TreeItemContextMenu
									key={element.id}
									element={element}
									idx={idx}
									trigger={
										<TreeItem
											element={element}
											isSelected={element.ui.isSelected}
											onClick={() => setIsSelected(idx)}
										/>
									}
								>
									{
										TypeToTitles[element.value.type].hasOwnProperty('form') ?
											//@ts-ignore
											TypeToTitles[element.value.type].form({
												defaultValues: element.value,
												submitButtonTitle: "Изменить",
												onSubmit: (values) => { updateElement(values, idx) }
											})
											: null
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
	element: GraphNode,
	onClick?: () => void,
	isSelected: boolean
}

const TreeItem: FC<TreeItemProps> = ({ element, onClick, isSelected }) => {
	return (
		<li onClick={onClick} className={`text-sm hover:ring-1 hover:ring-ring rounded-md w-full border border-transparent ${isSelected && ' border-gray-400'}`}>
			{element.name}
		</li>
	)
}

