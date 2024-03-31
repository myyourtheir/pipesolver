'use client'
import { FC, HTMLProps } from 'react'

interface TopLayoutProps {
	className: HTMLProps<HTMLElement>['className'],

}

const TopLayout: FC<TopLayoutProps> = ({ className }) => {

	return (
		<header className={`flex justify-between items-center p py-2 min-h-14 ${className}`}>
			<div className='px-4'>

			</div>
			<div className='px-4'>
				меню навигации
			</div>
		</header>
	)
}

export default TopLayout;



