'use client'
import Image from "next/image"
import ToolBar from './(components)/ToolBar'
import ConditionsBar from './(components)/ConditionsBar'
import { useEffect, useRef } from 'react'


export default function Home() {
	const containerRef = useRef(null)
	// useEffect(()=>{
	// 	fetch()
	// })
	return (
		<div ref={containerRef} className='flex relative w-full justify-center overflow-hidden h-full p-4'>
			<ToolBar containerRef={containerRef} />
			<ConditionsBar containerRef={containerRef} />
			<h1>
				home
			</h1>
		</div >
	)

}