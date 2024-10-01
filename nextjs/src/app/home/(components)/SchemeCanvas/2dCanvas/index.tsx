'use client'
import { Dispatch, MutableRefObject, Ref, RefObject, SetStateAction, Suspense, createContext, useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree, Vector3 } from "@react-three/fiber"
import { OrthographicCamera, OrbitControls } from "@react-three/drei"
import * as THREE from 'three'
import OrthograthicController from './CanvasController/OrthograthicController'
import { Stats } from '@react-three/drei'
import { useSelectedElementModeContext } from '@/app/home/(contexts)/useSelectedElementMode'
import { number } from 'zod'
import { useSpring } from '@react-spring/three'
import { useMove } from '@use-gesture/react'
import { animated } from '@react-spring/three'
import AddIntendElement from './AddIntendElement'
import LinkPoint from './CanvasController/Objects/LinkPoint'

export type CanvasContextProps = {
	setIsDragging: Dispatch<SetStateAction<boolean>>,
	floorPlane: THREE.Plane,
	openPoints: [number, number][],
	cameraRef: MutableRefObject<THREE.OrthographicCamera>,
	isDragging: boolean
}
export const CanvasContext = createContext<CanvasContextProps | null>(null)

const OrtoCanvas = () => {
	// const aspect = window?.innerWidth / window?.innerHeight
	const cameraRef = useRef<THREE.OrthographicCamera>(null!)
	const [isDragging, setIsDragging] = useState(false)
	const floorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1))
	const openPointsRef = useRef<[number, number][]>([])
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const { elementModeState } = useSelectedElementModeContext()
	return (
		<Canvas ref={canvasRef}>
			<Suspense fallback={null}>
				<CanvasContext.Provider value={{
					setIsDragging,
					floorPlane,
					isDragging,
					openPoints: openPointsRef.current,
					cameraRef
				}}>
					<Stats />
					<OrthographicCamera ref={cameraRef} makeDefault position={[0, 0, 10]} zoom={50} />
					<ambientLight />
					<directionalLight castShadow args={['yellow', 1]} position={cameraRef.current ? [cameraRef.current.position.x, -10, 5] : [0, -10, 5]} />
					<axesHelper args={[5]} />
					<OrbitControls
						enableZoom={true}
						enablePan={true}
						enableRotate={false}
						enableDamping={false}
						enabled={!isDragging}
					/>
					<OrthograthicController />
					{elementModeState.mode !== 'default' &&
						<AddIntendElement mode={elementModeState.mode} />
					}
				</CanvasContext.Provider>
			</Suspense>
		</Canvas>

	)
}

export default OrtoCanvas
