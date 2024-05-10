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
interface stylesType {
	zIndex: string,
	backgroundColor: string,
}

export const useDraggable = ({ refEventsElement, refTransformElement, refContainer }: props) => {
	const isClicked = useRef<boolean>(false)
	const styles = useRef<stylesType>({ zIndex: '0', backgroundColor: 'white' })
	const coords = useRef<coordsType>({
		startX: 0,
		startY: 0,
		lastX: 0,
		lastY: 0
	})

	useEffect(() => {
		if (refTransformElement.current) {
			coords.current = {
				startX: refTransformElement.current?.offsetLeft,
				startY: refTransformElement.current?.offsetTop,
				lastX: refTransformElement.current?.offsetLeft,
				lastY: refTransformElement.current?.offsetTop
			}
			styles.current = {
				zIndex: refTransformElement.current.style.zIndex,
				backgroundColor: refTransformElement.current.style.backgroundColor
			}
		}
	}, [refTransformElement])

	useEffect(() => {
		if (!refEventsElement.current || !refTransformElement.current || !refContainer.current) return
		const eventElement: HTMLElement = refEventsElement.current
		const transformElement: HTMLElement = refTransformElement.current
		const container: HTMLElement = refContainer.current

		const onMouseDown = (e: MouseEvent) => {
			transformElement.style.zIndex = '1000'
			// container.style.backgroundColor = 'rgba(52,62,64,0.1)'
			coords.current.startX = e.clientX
			coords.current.startY = e.clientY
			isClicked.current = true
		}
		const onTouchStart = (e: TouchEvent) => {
			transformElement.style.zIndex = '1000'
			coords.current.startX = e.touches[0].clientX
			coords.current.startY = e.touches[0].clientY
			isClicked.current = true
		}
		const onMouseUp = (e: MouseEvent) => {
			transformElement.style.zIndex = styles.current.zIndex
			// container.style.backgroundColor = styles.current.backgroundColor
			isClicked.current = false
			coords.current.lastX = transformElement.offsetLeft
			coords.current.lastY = transformElement.offsetTop
		}
		const onTouchEnd = (e: TouchEvent) => {
			transformElement.style.zIndex = styles.current.zIndex
			isClicked.current = false
			coords.current.lastX = transformElement.offsetLeft
			coords.current.lastY = transformElement.offsetTop
		}

		const onMouseMove = (e: MouseEvent) => {
			if (!isClicked.current) return

			const nextX = e.clientX - coords.current.startX + coords.current.lastX
			const nextY = e.clientY - coords.current.startY + coords.current.lastY
			if (nextX > 0 && nextX + transformElement.offsetWidth < container.offsetWidth) {
				transformElement.style.left = `${nextX}px`
			}
			if (nextY > 0 && nextY + transformElement.offsetHeight < container.offsetHeight) {
				transformElement.style.top = `${nextY}px`
			}
		}
		const onTouchMove = (e: TouchEvent) => {
			if (!isClicked.current) return

			const nextX = e.touches[0].clientX - coords.current.startX + coords.current.lastX
			const nextY = e.touches[0].clientY - coords.current.startY + coords.current.lastY
			if (nextX > 0 && nextX + transformElement.offsetWidth < container.offsetWidth) {
				transformElement.style.left = `${nextX}px`
			}
			if (nextY > 0 && nextY + transformElement.offsetHeight < container.offsetHeight) {
				transformElement.style.top = `${nextY}px`
			}
		}



		eventElement.addEventListener('mousedown', onMouseDown)
		container.addEventListener('mouseup', onMouseUp)
		container.addEventListener('mousemove', onMouseMove)
		container.addEventListener('mouseleave', onMouseUp)
		eventElement.addEventListener('touchstart', onTouchStart)
		container.addEventListener('touchend', onTouchEnd)
		container.addEventListener('touchmove', onTouchMove)


		const cleanUp = () => {
			eventElement.removeEventListener('mousedown', onMouseDown)
			container.removeEventListener('mouseup', onMouseUp)
			container.removeEventListener('mousemove', onMouseMove)
			container.removeEventListener('touchstart', onTouchStart)
			container.removeEventListener('touchend', onTouchEnd)
			container.removeEventListener('touchmove', onTouchMove)
			container.removeEventListener('mouseleave', onMouseUp)
		}
		return cleanUp

	}, [refContainer, refEventsElement, refTransformElement])
}