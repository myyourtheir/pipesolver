import PipeFav from '@/components/ui/PipeFav'

import PumpFav from '@/components/ui/PumpFav'
import GateValveFav from '@/components/ui/GateValveFav'
import SafeValveFav from '@/components/ui/SafeValveFav'

import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import ProviderElementContent from '@/components/ElementsContent/ProviderElementContent'
import ConsumerElementContent from '@/components/ElementsContent/ConsumerElementContent'
import PipeElementContent from '@/components/ElementsContent/PipeElementContent'

import GateValveElementContent from '@/components/ElementsContent/GateValveElementContent'
import SafeValveElementContent from '@/components/ElementsContent/SafeValveElementContent'
import Element, { ElementContext } from '@/components/Element'
import { ElementParamsUnion } from '../../../../../types/stateTypes'
import PumpElementContent from '@/components/ElementsContent/PumpElementContent'

const height = 60
const width = 60

const ElementsList = () => {

	const { pipeline, addElement } = useUnsteadyInputStore(state => state)
	const isBoundaryElements = pipeline.nodes.reduce((acc, item) => {
		if (item.value.type === 'provider') {
			acc.isProvider = true
		}
		if (item.value.type === 'consumer') {
			acc.isConsumer = true
		}
		if (item.value.type === 'pipe') {
			acc.isPipe = true
		}
		return acc
	}, { isProvider: false, isConsumer: false, isPipe: false })
	const submitButtonTitle = 'Добавить'
	const { isConsumer, isProvider, isPipe } = isBoundaryElements
	const onSubmit = (values: ElementParamsUnion) => {
		addElement(values, pipeline.nodes[pipeline.nodes.length - 1])
	}
	return (
		<div className='grid grid-cols-1  md:grid-cols-2 gap-2 items-center content-center [&>*]:h-full '>
			<div className='w-full flex items-center justify-center hover:ring-1 hover:ring-ring rounded-sm'>
				<Element
					hoverTitle='Поставщик'
					disabled={isProvider}
					TriggerContent={({ className }: { className: string }) => <ChevronsRight width={width} height={height} className={className} />}
				>
					<ProviderElementContent
						defaultValues={{
							type: 'provider',
							mode: 'pressure',
							value: 0
						}}
						onSubmit={onSubmit}
						submitButtonTitle={submitButtonTitle}
					/>
				</Element>
			</div>
			<div className='w-full flex items-center justify-center hover:ring-1 hover:ring-ring rounded-sm'>
				<Element
					hoverTitle='Потребитель'
					disabled={!isProvider || isConsumer || !isPipe}
					TriggerContent={({ className }: { className: string }) => <ChevronsLeft width={width} height={height} className={className} />}
				>
					<ConsumerElementContent
						defaultValues={{
							type: 'consumer',
							mode: 'pressure',
							value: 0
						}}
						onSubmit={onSubmit}
						submitButtonTitle={submitButtonTitle}
					/>
				</Element>
			</div>
			<div className='w-full flex items-center justify-center hover:ring-1 hover:ring-ring rounded-sm'>
				<Element
					hoverTitle='Труба'
					disabled={!isProvider || isConsumer}
					TriggerContent={({ className }: { className: string }) => <PipeFav width={width} height={height} className={className} />}
				>
					<PipeElementContent
						defaultValues={{
							type: 'pipe',
							length: 100,
							diameter: 1000,
						}}
						onSubmit={onSubmit}
						submitButtonTitle={submitButtonTitle}
					/>
				</Element>
			</div>
			<div className='w-full flex items-center justify-center hover:ring-1 hover:ring-ring rounded-sm'>
				<Element
					hoverTitle='Насос'
					disabled={!isProvider || isConsumer}
					TriggerContent={({ className }: { className: string }) => <PumpFav width={45} height={45} className={className} />}
				>
					<PumpElementContent
						defaultValues={{
							type: 'pump',
							coef_a: 310,
							coef_b: 0.0000008,
							mode: 'open',
							start_time: 0,
							duration: 20,
						}}
						onSubmit={onSubmit}
						submitButtonTitle={submitButtonTitle}
					/>
				</Element>
			</div>
			<div className='w-full flex items-center justify-center hover:ring-1 hover:ring-ring rounded-sm'>
				<Element
					hoverTitle='Задвижка'
					disabled={!isProvider || isConsumer}
					TriggerContent={({ className }: { className: string }) => <GateValveFav width={width} height={height} className={className} />}
				>
					<GateValveElementContent
						defaultValues={{
							type: 'gate_valve',
							mode: 'open',
							start_time: 0,
							duration: 100,
							percentage: 100
						}}
						onSubmit={onSubmit}
						submitButtonTitle={submitButtonTitle}
					/>
				</Element>
			</div>
			<div className='w-full flex items-center justify-center hover:ring-1 hover:ring-ring rounded-sm'>
				<Element
					hoverTitle='Предохранительный клапан'
					disabled={!isProvider || isConsumer}
					TriggerContent={({ className }: { className: string }) => <SafeValveFav width={55} height={55} className={className} />}
				>
					<SafeValveElementContent
						defaultValues={{
							type: 'safe_valve',
							coef_q: 0.5,
							max_pressure: 9
						}}
						onSubmit={onSubmit}
						submitButtonTitle={submitButtonTitle}
					/>
				</Element>
			</div>
		</div>
	)
}

export default ElementsList