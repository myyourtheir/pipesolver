'use client'
import Image from "next/image"
import ElementsBar from './(components)/ElementsBar'
import ConditionsBar from './(components)/ConditionsBar'
import { useEffect, useRef } from 'react'
import SchemeCanvas from './(components)/SchemeCanvas'
import ElementsTree from './(components)/ElementsTree'


export default function Home() {
	const containerRef = useRef(null)
	// useEffect(()=>{
	// 	fetch()
	// })
	return (
		<div ref={containerRef} className='flex relative w-full justify-center items-center overflow-hidden h-full p-4'>
			<SchemeCanvas containerRef={containerRef} />
			<ElementsBar containerRef={containerRef} />
			<ElementsTree containerRef={containerRef} />
			{/* <ConditionsBar containerRef={containerRef} /> */}
		</div >
	)

}
