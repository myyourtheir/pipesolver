import PipeFav from '@/components/ui/PipeFav'

import PumpFav from '@/components/ui/PumpFav'
import GateValveFav from '@/components/ui/GateValveFav'
import SafeValveFav from '@/components/ui/SafeValveFav'
import PipeElementContent from './Elements/PipeElementContent'
import PumpElementContent from './Elements/PumpElementContent'
import GateValveElementContent from './Elements/GateValveElementContent'
import SafeValveElementContent from './Elements/SafeValveElementContent'
import Element from './Elements/Element'

const height = 60
const width = 60

const ElementsList = () => {
	return (
		<div className='grid grid-cols-1  md:grid-cols-2 gap-2 items-center content-center'>
			<div className='w-full flex items-center justify-center'>
				<Element hoverTitle='Труба' TriggerContent={() => <PipeFav width={width} height={height} />}>
					<PipeElementContent />
				</Element>
			</div>
			<div className='w-full flex items-center justify-center'>
				<Element hoverTitle='Насос' TriggerContent={() => <PumpFav width={45} height={45} />}>
					<PumpElementContent />
				</Element>
			</div>
			<div className='w-full flex items-center justify-center'>
				<Element hoverTitle='Задвижка' TriggerContent={() => <GateValveFav width={width} height={height} />}>
					<GateValveElementContent />
				</Element>
			</div>
			<div className='w-full flex items-center justify-center'>
				<Element hoverTitle='Предохранительный клапан' TriggerContent={() => <SafeValveFav width={55} height={55} />}>
					<SafeValveElementContent />
				</Element>
			</div>
		</div>
	)
}

export default ElementsList