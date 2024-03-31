'use client'
import Image from "next/image"
import ToolBar from './(components)/ToolBar'
import ConditionsBar from './(components)/ConditionsBar'
import { useRef } from 'react'


export default function Home() {
	const containerRef = useRef(null)
	return (
		<div ref={containerRef} className='flex relative w-full justify-center overflow-hidden h-full'>
			<ToolBar containerRef={containerRef} />
			<ConditionsBar containerRef={containerRef} />
			<h1>
				home
			</h1>
		</div >
	)

}
