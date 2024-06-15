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
	const submitButtonTitle = 'Добавить'
	const onSubmit = (values: ElementParamsUnion) => {
		addElement(values)
	}
	return (
		<div className='grid grid-cols-1  md:grid-cols-2 gap-2 items-center content-center [&>*]:h-full '>
			<div className='w-full flex items-center justify-center hover:ring-1 hover:ring-ring rounded-sm'>
				<Element
					hoverTitle='Поставщик'
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