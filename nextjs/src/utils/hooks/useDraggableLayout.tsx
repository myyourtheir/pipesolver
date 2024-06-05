import { useSpring } from '@react-spring/web'
import { useDrag, useGesture } from '@use-gesture/react'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'
import { FC, RefObject, useCallback } from 'react'

interface UseDLProps {
	containerRef: RefObject<HTMLElement>
	elementRef: RefObject<HTMLElement>
}

const useDraggableLayout = ({ containerRef, elementRef }: UseDLProps) => {
	const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))

	console.log(elementRef)
	const getBounds = useCallback(() => {

		const bounds = (containerRef.current as HTMLElement).getBoundingClientRect()
		return {
			top: bounds.top,
			left: bounds.left,
			right: bounds.right,
			bottom: bounds.bottom,
		}
	}, [containerRef])
	const bind = useGesture(
		{
			onDrag: ({ down, offset: [ox, oy], velocity: [vx, vy], direction: [dx, dy] }) => {
				api.start({
					x: ox,
					y: oy,
					// immediate: true,
					onChange: ({ value }) => {
						console.log(value)
						// const bounds = getBounds()
						// if (
						// 	!(value.x >= bounds.left && value.x <= bounds.right && value.y >= bounds.top && value.y <= bounds.bottom)
						// ) {
						// 	api.set({
						// 		x: value.x < bounds.left ? bounds.left : value.x > bounds.right ? bounds.right : value.x,
						// 		y: value.y < bounds.top ? bounds.top : value.y > bounds.bottom ? bounds.bottom : value.y,
						// 	})
						// }
					},
					// config: key => {
					// 	return {
					// 		velocity: key === 'x' ? vx * dx : vy * dy,
					// 		decay: true,
					// 	}
					// },
				})
			},
		}
	)

	// const bind = useDrag(({ offset: [ox, oy] }) => {
	// 	api.start({
	// 		x: ox,
	// 		y: oy,
	// 	})
	// })
	return {
		styles: { x, y },
		bind
	}
}

export default useDraggableLayout