'use client'
import { Button } from '@/components/ui/button'
import { useResultsStore } from '@/lib/globalStore/resultsStore'
import { useCallUnsteadyFlowWs } from '@/utils/hooks/useCallUnsteadyFlowWs'

import { Play } from 'lucide-react'
import { FC, HTMLProps } from 'react'

interface TopLayoutProps {
	className: HTMLProps<HTMLElement>['className'],

}

const TopLayout: FC<TopLayoutProps> = ({ className }) => {
	const { setIter } = useResultsStore()
	const [calcUnsteadyFlow] = useCallUnsteadyFlowWs()
	return (
		<header className={`flex justify-start items-center bg-slate-50 shadow-[0_8px_8px_-10px_rgba(0,_0,_0,_.15)] border-none py-2 min-h-[52px]  ${className}`}>
			<div className='px-4'>
			</div>
			<div className='px-4'>
				<Button
					className='w-fit'
					onClick={() => {
						const promise = new Promise((res, rej) => {
							res(setIter(0))
						})
						promise.then(() =>
							calcUnsteadyFlow()
						)
					}}
				>
					Расcчитать
				</Button>
			</div>
		</header>
	)
}

export default TopLayout;



