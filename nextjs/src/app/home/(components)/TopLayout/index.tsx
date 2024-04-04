'use client'
import { FC, HTMLProps } from 'react'

interface TopLayoutProps {
	className: HTMLProps<HTMLElement>['className'],

}

const TopLayout: FC<TopLayoutProps> = ({ className }) => {

	return (
		<header className={`flex justify-between items-center bg-slate-50 shadow-[0_8px_8px_-10px_rgba(0,_0,_0,_.15)] border-none py-2 min-h-[52px] ${className}`}>
			<div className='px-4'>
			</div>
			<div className='px-4'>
				меню навигации
			</div>
		</header>
	)
}

export default TopLayout;



