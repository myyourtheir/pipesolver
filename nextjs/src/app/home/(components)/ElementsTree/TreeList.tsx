import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { FC, memo, useMemo } from 'react'
import { ElementParamsUnion, ElementsType, UnsteadyInputData } from '../../../../../types/stateTypes'
import TreeItemContextMenu from './TreeItemContextMenu'

const typeToTitles: Record<ElementsType, string> = {
	pipe: 'Труба',
	pump: 'Насос',
	consumer: 'Потребитель',
	provider: 'Поставщик',
	gate_valve: 'Задвижка',
	safe_valve: 'Клапан'
}

const TreeList = () => {
	const { pipeline: elements, setIsSelected } = useUnsteadyInputStore(state => state)
	const elementsMemo = useMemo(() => elements, [elements])
	return (
		<div className='w-full h-full'>
			{
				elements.length !== 0 ? (
					<ul >
						{
							elementsMemo.map((element, idx) => (
								<TreeItemContextMenu key={idx} className={`${element.uiConfig.selected ? 'border-purple-700 border-1' : 'border-0'}`} element={element} idx={idx}>
									<TreeItem element={element} onClick={() => setIsSelected(idx)} />
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
		</div>
	)
}

export default TreeList


export interface TreeItemProps {
	element: ElementParamsUnion,
	onClick?: () => void
}

const TreeItem: FC<TreeItemProps> = ({ element, onClick }) => {

	return (
		<li onClick={onClick}>
			{typeToTitles[element.type]}
		</li>
	)
}

