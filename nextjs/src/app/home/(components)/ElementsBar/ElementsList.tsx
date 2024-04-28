import PipeFav from '@/components/ui/PipeFav'

import PumpFav from '@/components/ui/PumpFav'
import GateValveFav from '@/components/ui/GateValveFav'
import SafeValveFav from '@/components/ui/SafeValveFav'
import PipeElementContent from './Elements/PipeElementContent'
import PumpElementContent from './Elements/PumpElementContent'
import GateValveElementContent from './Elements/GateValveElementContent'
import SafeValveElementContent from './Elements/SafeValveElementContent'
import Element from '../../../../components/Element'
import ConsumerElementContent from './Elements/ConsumerElementContent'
import ProviderElementContent from './Elements/ProviderElementContent'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'

const height = 60
const width = 60

const ElementsList = () => {
	const pipeline = useUnsteadyInputStore(state => state.pipeline)
	const isBoundaryElements = pipeline.reduce((acc, item) => {
		if (item.type === 'provider') {
			acc.isProvider = true
		}
		if (item.type === 'consumer') {
			acc.isConsumer = true
		}
		if (item.type === 'pipe') {
			acc.isPipe = true
		}
		return acc
	}, { isProvider: false, isConsumer: false, isPipe: false })
	const { isConsumer, isProvider, isPipe } = isBoundaryElements
	return (
		<div className='grid grid-cols-1  md:grid-cols-2 gap-2 items-center content-center'>
			<div className='w-full flex items-center justify-center'>
				<Element hoverTitle='Поставщик' disabled={isProvider} TriggerContent={() => <ChevronsRight width={width} height={height} />}>
					<ProviderElementContent />
				</Element>
			</div>
			<div className='w-full flex items-center justify-center'>
				<Element hoverTitle='Потребитель' disabled={!isProvider || isConsumer || !isPipe} TriggerContent={() => <ChevronsLeft width={width} height={height} />}>
					<ConsumerElementContent />
				</Element>
			</div>
			<div className='w-full flex items-center justify-center'>
				<Element hoverTitle='Труба' disabled={!isProvider || isConsumer} TriggerContent={() => <PipeFav width={width} height={height} />}>
					<PipeElementContent />
				</Element>
			</div>
			<div className='w-full flex items-center justify-center'>
				<Element hoverTitle='Насос' disabled={!isProvider || isConsumer} TriggerContent={() => <PumpFav width={45} height={45} />}>
					<PumpElementContent />
				</Element>
			</div>
			<div className='w-full flex items-center justify-center'>
				<Element hoverTitle='Задвижка' disabled={!isProvider || isConsumer} TriggerContent={() => <GateValveFav width={width} height={height} />}>
					<GateValveElementContent />
				</Element>
			</div>
			<div className='w-full flex items-center justify-center'>
				<Element hoverTitle='Предохранительный клапан' disabled={!isProvider || isConsumer} TriggerContent={() => <SafeValveFav width={55} height={55} />}>
					<SafeValveElementContent />
				</Element>
			</div>
		</div>
	)
}

export default ElementsList