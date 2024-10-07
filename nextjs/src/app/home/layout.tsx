

import React, { useState } from 'react'
import TopLayout from './(components)/TopLayout'

function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {

	return (
		<div className='flex flex-col h-[100vh]'>
			<TopLayout className='row-start-1' />
			<div className='flex-1'>
				<main className='h-full'>
					{children}
				</main>
			</div>
		</div>
	)
}

export default HomeLayout