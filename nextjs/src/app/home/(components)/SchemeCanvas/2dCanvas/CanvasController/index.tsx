import { useContext } from 'react'
import MoveObj from './Objects/MoveObj'
import { CanvasContext, CanvasContextProps } from '..'

const OthograthicController = () => {
	const { openPoints } = useContext(CanvasContext) as CanvasContextProps
	const arr = [
		<MoveObj color='white' position={[0, 0, 0]} w={3} h={2} key={1} />,
		<MoveObj color='white' position={[4, 5, 0]} w={2} h={2} key={2} />
	]

	console.log(openPoints)
	return (
		<>
			{
				arr.map(obj => obj)
			}
		</>
	)
}

export default OthograthicController