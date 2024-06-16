import { GraphNode } from '@/utils/graph/GraphNode'
import { useThree } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { OthograthicConfig } from '../../OthograthicConfig'

type UseDrawOpenElementsCirclesProps = {
	openElements: Set<GraphNode>,
	currentElement: GraphNode
}

const { clingRadius } = OthograthicConfig

const useOpenElementsCircles = ({ openElements, currentElement }: UseDrawOpenElementsCirclesProps) => {
	const [isCirclesDrawn, setIsCirclesDrawn] = useState(false)
	const { scene } = useThree()
	const circlesRef = useRef<THREE.LineSegments[]>([])

	const drawOpenElementsCircles = () => {
		openElements.forEach((item => {
			if (item === currentElement) return
			const geometry = new THREE.CylinderGeometry(clingRadius, clingRadius, 0)
			const edges = new THREE.EdgesGeometry(geometry)
			const material = new THREE.LineDashedMaterial({
				color: 0xffff00,
				dashSize: 0.1,
				gapSize: 0.1,
				linewidth: 0.1,
			})
			const cylinder = new THREE.LineSegments(edges, material)
			cylinder.position.set(...item.ui.position)
			cylinder.rotateX(Math.PI / 2)
			circlesRef.current.push(cylinder)
			scene.add(cylinder)
			setIsCirclesDrawn(true)

		}))
	}

	const eraseOpenElementsCircles = () => {
		circlesRef.current.forEach((item) =>
			scene.remove(item)
		)
		circlesRef.current = []
		setIsCirclesDrawn(false)
	}

	return ({ drawOpenElementsCircles, isCirclesDrawn, eraseOpenElementsCircles })
}

export default useOpenElementsCircles