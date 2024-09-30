import { ReactNode, useEffect, useRef } from 'react'

type EventListenerProps = {
	eventName: string,
	handler: (e: any) => any,
	element?: any
}

const useEventListener = ({ eventName, handler, element = window }: EventListenerProps) => {
	const savedHandler = useRef((event: any) => { })

	useEffect(() => {
		savedHandler.current = handler
	}, [handler])

	useEffect(() => {
		if (savedHandler.current) {
			const eventListener = (event: MouseEvent | KeyboardEvent) => savedHandler.current(event)
			element.addEventListener(eventName, eventListener)
			return () => {
				element.removeEventListener(eventName, eventListener)
			}
		}
	}, [eventName, element])
}

export default useEventListener