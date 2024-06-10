import { Dispatch, MutableRefObject, SetStateAction, Suspense, createContext, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrthographicCamera, OrbitControls } from "@react-three/drei"
import { OthograthicConfig } from './OthograthicConfig'
import MoveObj from './CanvasController/Objects/MoveObj'

import * as THREE from 'three'
import OrthograthicController from './CanvasController/OrthograthicController'



const { numberOrderScale } = OthograthicConfig
export type CanvasContextProps = {
	setIsDragging: Dispatch<SetStateAction<boolean>>,
	floorPlane: THREE.Plane,
	openPoints: [number, number][],
	cameraRef: MutableRefObject<THREE.OrthographicCamera>
}
export const CanvasContext = createContext<CanvasContextProps | null>(null)

const { frustumSize, aspect } = OthograthicConfig


const OrtoCanvas = () => {
	const cameraRef = useRef<THREE.OrthographicCamera>(null!)
	const [isDragging, setIsDragging] = useState(false)
	const floorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1))
	const openPointsRef = useRef<[number, number][]>([])
	return (
		<Canvas >
			<Suspense fallback={null}>
				<CanvasContext.Provider value={{
					setIsDragging,
					floorPlane,
					openPoints: openPointsRef.current,
					cameraRef
				}}>
					<OrthographicCamera ref={cameraRef} makeDefault args={[(frustumSize * aspect) / -2,
					(frustumSize * aspect) / 2,
					frustumSize / 2,
					frustumSize / -2,
						1,
						1000]} position={[0, 0, 10]} zoom={50} />
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
				</CanvasContext.Provider>
			</Suspense>
		</Canvas>

	)
}

export default OrtoCanvas
