import { RefObject, useEffect, useRef, useState } from 'react'

interface props {
	refEventsElement: RefObject<HTMLElement>,
	refTransformElement: RefObject<HTMLElement>,
	refContainer: RefObject<HTMLElement>
}

interface coordsType {
	startX: number,
	startY: number,
	lastX: number,
	lastY: number
}

export const useDraggable = ({ refEventsElement, refTransformElement, refContainer }: props) => {
	const isClicked = useRef<boolean>(false)
	const coords = useRef<coordsType>({
		startX: 0,
		startY: 0,
		lastX: 0,
		lastY: 0
	})

	useEffect(() => {
		if (!refEventsElement.current || !refTransformElement.current || !refContainer.current) return
		const eventElement = refEventsElement.current
		const transformElement = refTransformElement.current
		const container = refContainer.current
		const onMouseDown = (e: MouseEvent) => {
			coords.current.startX = e.clientX
			coords.current.startY = e.clientY
			isClicked.current = true
		}
		const onMouseUp = (e: MouseEvent) => {
			isClicked.current = false
			coords.current.lastX = transformElement.offsetLeft
			coords.current.lastY = transformElement.offsetTop
		}

		const onMouseMove = (e: MouseEvent) => {
			if (!isClicked.current) return

			const nextX = e.clientX - coords.current.startX + coords.current.lastX
			const nextY = e.clientY - coords.current.startY + coords.current.lastY

			transformElement.style.top = `${nextY}px`
			transformElement.style.left = `${nextX}px`
		}


		eventElement.addEventListener('mousedown', onMouseDown)
		eventElement.addEventListener('mouseup', onMouseUp)
		container.addEventListener('mousemove', onMouseMove)
		container.addEventListener('mouseleave', onMouseUp)


		const cleanUp = () => {
			eventElement.removeEventListener('mousedown', onMouseDown)
			eventElement.removeEventListener('mouseup', onMouseUp)
			container.removeEventListener('mousemove', onMouseMove)
			container.removeEventListener('mouseleave', onMouseUp)
		}
		return cleanUp

	}, [refContainer, refEventsElement, refTransformElement])
}