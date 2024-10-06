'use client'
import Image from "next/image"
import ElementsBar from './(components)/ElementsBar'
import ConditionsBar from './(components)/ConditionsBar'
import { use, useEffect, useRef } from 'react'
import SchemeCanvas from './(components)/SchemeCanvas'
import ElementsTree from './(components)/ElementsTree'
import ResultChart from './(components)/ResultChart'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { SelectedElementModeContext } from './(contexts)/useSelectedElementMode'
import { DefaultElementsConfigContext } from './(contexts)/useDefaultElementsConfig'
import { PipeElementContextProvider } from './(contexts)/useNewPipeElementContext'
import { useBlockDisplayStore } from '@/lib/globalStore/blockDisplayStore'




export default function Home() {


	const containerRef = useRef(null)
	const openController = useBlockDisplayStore()
	return (
		<SelectedElementModeContext>
			<DefaultElementsConfigContext>
				<PipeElementContextProvider>
					<div ref={containerRef} className='flex relative w-full justify-center items-center overflow-hidden h-full p-4'>
						<SchemeCanvas containerRef={containerRef} />
						<ElementsBar
							open={openController.elementsBarDisplay} toggleOpen={openController.toggleElementsBar} containerRef={containerRef}
						/>
						<ElementsTree
							open={openController.elementsTreeDisplay} toggleOpen={openController.toggleElementsTree} containerRef={containerRef}
						/>
						<ResultChart
							open={openController.resultChartDisplay} toggleOpen={openController.toggleResultChart} containerRef={containerRef}
						/>
						<ConditionsBar
							open={openController.conditionsBarDisplay} toggleOpen={openController.toggleConditionsBar} containerRef={containerRef}
						/>
					</div >
				</PipeElementContextProvider>
			</DefaultElementsConfigContext>
		</SelectedElementModeContext>
	)

}
