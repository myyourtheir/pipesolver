'use client'
import { FC, HTMLProps } from 'react'
import CalcAndTimeBlock from './CalcAndTimeBlock'

interface TopLayoutProps {
	className: HTMLProps<HTMLElement>['className'],

}

const TopLayout: FC<TopLayoutProps> = ({ className }) => {

	return (
		<header className={`w-full bg-slate-50 shadow-[0_8px_8px_-10px_rgba(0,_0,_0,_.15)] border-none py-2 min-h-[52px]  ${className}`}>
			<CalcAndTimeBlock />
		</header>
	)
}

export default TopLayout;



