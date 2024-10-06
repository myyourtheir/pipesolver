import DraggableLayout from '@/components/ui/draggableLayout'
import { useResultsStore } from '@/lib/globalStore/resultsStore'
import { FC, useEffect, useRef, useState } from 'react'
import { ElementsProps } from '../ElementsBar'
import MyChart from './chart'
import { useUnsteadyInputStore } from '@/lib/globalStore/unsteadyFlowStore'
import { Button } from '@/components/ui/button'
import { Pause, PlayIcon, TimerReset } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import buildChartData from './buildChartData'
import { SelectedElementsChartContextProvider } from './chart/SelectedElementsChartContext'


const ResultChart: FC<ElementsProps> = ({ containerRef, open, toggleOpen }) => {
	const { chartData, iter, setIter } = useResultsStore(state => state)
	const [charts, setCharts] = useState<string[]>([])
	const intervalRef = useRef<NodeJS.Timeout>()
	// const [iter, setIter] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const [speed, setSpeed] = useState(100)
	const { time_to_iter: duration } = useUnsteadyInputStore(state => state.cond_params)
	const startTimer = (ms: number) => {
		if (intervalRef.current)
			clearInterval(intervalRef.current)
		intervalRef.current = setInterval(() => {
			if (isPlaying) {
				setIter(prevIter => prevIter + 1)
			}
		}, ms)
	}

	// Проверка на конец итераций
	useEffect(() => {
		if (chartData.length !== 0 && chartData[iter]?.t >= duration) {
			setIsPlaying(false)
		}
	}, [chartData, duration, iter])
	// переход к след значениям
	useEffect(() => {
		if (isPlaying) {
			startTimer(speed)
		} else {
			clearInterval(intervalRef.current)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isPlaying, speed])

	const handlePlayPauseClick = () => {
		setIsPlaying(prev => !prev)
	}
	// if (chartData.length !== 0) {
	return (
		<DraggableLayout open={open} toggleOpen={toggleOpen} refContainer={containerRef} headerName='Результаты расчета' className='top-10  left-52' hideable={true} defaultState={true} >
			<section>
				<div className='flex justify-between items-center w-full'>
					<div className='flex gap-2 items-center'>
						<Button
							onClick={handlePlayPauseClick}
							className='w-10 h-8 p-2'>
							{
								isPlaying
									? <Pause size={18} />
									: <PlayIcon size={18} />
							}
						</Button>
						<Button
							onClick={() => { setIter(0) }}
							className='w-10 h-8 p-2'>
							<TimerReset size={18} />
						</Button>
					</div>
					<Select value={speed.toString()} onValueChange={(value) => setSpeed(parseFloat(value))}>
						<SelectTrigger className="w-20">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={'100'}>1:10</SelectItem>
							<SelectItem value={'500'}>1:2</SelectItem>
							<SelectItem value={'1000'}>1:1</SelectItem>
						</SelectContent>
					</Select>
					<div className='w-[102px]'>
						Время: {chartData[iter]?.t} c
					</div>
				</div>
				<div className='h-3 flex items-end'>
					{
						chartData.length >= duration &&
						<Slider value={[iter]}
							onValueChange={(value) => {
								setIter(value[0])
							}}
							max={duration}
							step={1} />
					}
				</div>
				<Button onClick={() => setCharts(prev => [...prev, Date.now().toString()])} className='m-2'>
					+
				</Button>

				<div className='flex gap-4'>
					{
						charts.map(id =>
							<SelectedElementsChartContextProvider key={id} chartId={id} setCharts={setCharts}>
								<MyChart chartData={chartData} index={iter} />
							</SelectedElementsChartContextProvider>

						)
					}
				</div>
			</section>
		</DraggableLayout>
	)
	// }

}
export default ResultChart