

import React, { useState } from 'react'
import TopLayout from './(components)/TopLayout'
function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {

	return (
		<div className='grid grid-rows-[64px_1fr] h-[100vh]'>
			<TopLayout className='row-start-1' />
			<div className='grid row-start-2 grid-cols-1'>
				<main className='h-full'>
					{children}
				</main>
			</div>
		</div>
	)
}

export default HomeLayout