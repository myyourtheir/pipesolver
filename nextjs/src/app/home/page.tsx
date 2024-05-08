'use client'
import Image from "next/image"
import ElementsBar from './(components)/ElementsBar'
import ConditionsBar from './(components)/ConditionsBar'
import { useEffect, useRef } from 'react'
import SchemeCanvas from './(components)/SchemeCanvas'
import ElementsTree from './(components)/ElementsTree'
import ResultChart from './(components)/ResultChart'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'



export default function Home() {
	const { pipeline } = useUnsteadyInputStore()
	console.log(pipeline)
	console.log(pipeline.nodes[pipeline.nodes.length - 1])
	const containerRef = useRef(null)
	return (
		<div ref={containerRef} className='flex relative w-full justify-center items-center overflow-hidden h-full p-4'>
			<SchemeCanvas containerRef={containerRef} />
			<ElementsBar containerRef={containerRef} />
			<ElementsTree containerRef={containerRef} />
			<ResultChart containerRef={containerRef} />
			{/* <ConditionsBar containerRef={containerRef} /> */}
		</div >
	)

}
