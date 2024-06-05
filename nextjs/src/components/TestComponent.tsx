import { animated, useSpring } from '@react-spring/web'
import { useEffect, useRef } from 'react'
import { createUseGesture, useDrag } from '@use-gesture/react'
export function TestComponent() {
	const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
	const bind = useDrag(({ offset: [ox, oy] }) => {
		api.start({
			x: ox,
			y: oy,
		})
	})
	return <animated.div {...bind()} style={{ x, y }} className={'w-96 h-96 bg-red-500 rounded-md touch-none'} />
}
