import DraggableLayout from '@/components/ui/draggableLayout'
import { useResultsStore } from '@/lib/globalStore/resultsStore'
import { FC, useEffect, useRef, useState } from 'react'
import { ElementsProps } from '../ElementsBar'
import MyChart from './chart'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'

const ResultChart: FC<ElementsProps> = ({ containerRef }) => {
	const { chartData } = useResultsStore(state => state)
	const [iter, setIter] = useState(0)
	const intervalRef = useRef<NodeJS.Timeout>()
	const [isPlaying, setIsPlaying] = useState(true)
	const { time_to_iter: duration } = useUnsteadyInputStore(state => state.cond_params)
	useEffect(() => {
		if (chartData.length > duration * 0.2)
			startTimer()
	})

	// useEffect(() => {
	// 	if (isPlaying) {
	// 		startTimer()
	// 	} else {
	// 		audioRef.current.pause()
	// 	}
	// }, [isPlaying])

	// useEffect(() => {
	// 	return () => {
	// 		audioRef.current.pause()
	// 		clearInterval(intervalRef.current)
	// 	}
	// }, [])

	// useEffect(() => {
	// 	audioRef.current.pause()

	// 	audioRef.current = new Audio(tracks[currentIndex].url)
	// 	setTrackProgress(audioRef.current.currentTime)

	// 	if (isReady) {
	// 		audioRef.current.play()
	// 		if (!isPlaying) {
	// 			setIsPlaying(true)
	// 		}
	// 		startTimer()
	// 	} else {
	// 		setIsReady(true)
	// 	}
	// }, [currentIndex])

	const startTimer = () => {
		if (intervalRef.current)
			clearInterval(intervalRef.current)
		intervalRef.current = setInterval(() => {
			if (iter + 1 >= duration) {
				setIsPlaying(false)
			} else {
				setIter(iter => iter + 1)
			}
		}, 100)
	}



	// const handlePlayPauseClick = () => {
	// 	if (isPlaying) {
	// 		setIsPlaying(false)
	// 	} else {
	// 		setIsPlaying(true)
	// 	}
	// }

	// const onScrub = (value) => {
	// 	// Clear any timers already running
	// 	clearInterval(intervalRef.current)
	// 	audioRef.current.currentTime = value
	// 	setTrackProgress(audioRef.current.currentTime)
	// }

	// const onScrubEnd = () => {
	// 	if (!isPlaying) {
	// 		setIsPlaying(true)
	// 	}
	// 	startTimer()
	// }
	if (chartData.length !== 0) {
		return (
			<DraggableLayout refContainer={containerRef} headerName='Результаты расчета' className='top-5 self-center w-96' hideable={true} defaultState={true}>
				{chartData[iter].t}
				<MyChart data={chartData[iter]} />
			</DraggableLayout>
		)


	}

}
export default ResultChart