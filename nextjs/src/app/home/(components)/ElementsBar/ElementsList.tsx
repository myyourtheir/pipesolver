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
import { useDefaultElementsConfig } from '../../(contexts)/useDefaultElementsConfig'
import TeeFav from '@/components/ui/TeeFav'

const height = 60
const width = 60

const ElementsList = () => {

	const submitButtonTitle = 'Добавить'
	const { defaultValues, defaultValuesDispatch } = useDefaultElementsConfig()
	const onSubmit = (values: ElementParamsUnion) => {
		defaultValuesDispatch({ type: 'setDefaultElementConfig', value: values })
	}
	return (
		<div className='grid grid-cols-1  md:grid-cols-2 gap-2 items-center content-center [&>*]:h-full '>
			<Element
				elementType='provider'
				hoverTitle='Поставщик'
				TriggerContent={({ className }: { className: string }) => <ChevronsRight width={width} height={height} className={className} />}
			>
				<ProviderElementContent
					defaultValues={defaultValues['provider']}
					onSubmit={onSubmit}
					submitButtonTitle={submitButtonTitle}
				/>
			</Element>

			<Element
				elementType='consumer'
				hoverTitle='Потребитель'
				TriggerContent={({ className }: { className: string }) => <ChevronsLeft width={width} height={height} className={className} />}
			>
				<ConsumerElementContent
					defaultValues={defaultValues['consumer']}
					onSubmit={onSubmit}
					submitButtonTitle={submitButtonTitle}
				/>
			</Element>
			<Element
				elementType='pipe'
				hoverTitle='Труба'
				TriggerContent={({ className }: { className: string }) => <PipeFav width={width} height={height} className={className} />}
			>
				<PipeElementContent
					defaultValues={defaultValues['pipe']}
					onSubmit={onSubmit}
					submitButtonTitle={submitButtonTitle}
				/>
			</Element>
			<Element
				elementType='pump'
				hoverTitle='Насос'
				TriggerContent={({ className }: { className: string }) => <PumpFav width={45} height={45} className={className} />}
			>
				<PumpElementContent
					defaultValues={defaultValues['pump']}
					onSubmit={onSubmit}
					submitButtonTitle={submitButtonTitle}
				/>
			</Element>

			<Element
				elementType='gate_valve'
				hoverTitle='Задвижка'
				TriggerContent={({ className }: { className: string }) => <GateValveFav width={width} height={height} className={className} />}
			>
				<GateValveElementContent
					defaultValues={defaultValues['gate_valve']}
					onSubmit={onSubmit}
					submitButtonTitle={submitButtonTitle}
				/>
			</Element>


			<Element
				elementType='safe_valve'
				hoverTitle='Предохранительный клапан'
				TriggerContent={({ className }: { className: string }) => <SafeValveFav width={55} height={55} className={className} />}
			>
				<SafeValveElementContent
					defaultValues={defaultValues['safe_valve']}
					onSubmit={onSubmit}
					submitButtonTitle={submitButtonTitle}
				/>
			</Element>
			<Element
				elementType='tee'
				hoverTitle='Тройник'
				TriggerContent={({ className }: { className: string }) => <TeeFav width={55} height={55} className={className} />}
			/>
		</div>

	)
}

export default ElementsList