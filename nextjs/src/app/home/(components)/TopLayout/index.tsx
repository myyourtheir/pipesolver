'use client'
import { FC, HTMLProps } from 'react'
import CalcAndTimeBlock from './CalcAndTimeBlock'
import BarsOpenController from './BarsOpenController'
import TopMenuBar from './MenuBar'

interface TopLayoutProps {
	className: HTMLProps<HTMLElement>['className'],
}

const TopLayout: FC<TopLayoutProps> = ({ className }) => {

	return (
		<header className={`w-full bg-slate-50 shadow-[0_8px_8px_-10px_rgba(0,_0,_0,_.15)] border-none min-h-[72px]  ${className}`}>
			<div className='mb-2'>
				<TopMenuBar />
			</div>
			<div className='flex gap-2 justify-between items-center mx-4 my-2'>
				<BarsOpenController />
				<CalcAndTimeBlock />
			</div>
		</header>
	)
}

export default TopLayout;



