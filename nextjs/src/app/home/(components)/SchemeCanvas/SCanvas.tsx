import React, { FC, MutableRefObject, SVGLineElementAttributes, Suspense, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, MeshProps, useFrame } from '@react-three/fiber'
import { BufferGeometry } from 'three'
import * as THREE from "three"
import { OrbitControls, Preload, useGLTF, Stage, Line } from "@react-three/drei"
import ElementsController from './ElementsController'
const SCanvas = () => {
	const points = [
		[0, 0, 1],
		[1, 1, 1],
		[2, 2, 2],
	]
	return (
		<Canvas>
			<Suspense fallback={null}>
				<OrbitControls
					enableZoom={true}
					enablePan={true}
					enableRotate={true}
				/>
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
				<pointLight position={[10, 10, 10]} decay={0} intensity={Math.PI} />
				<axesHelper args={[5]} />
				{/* <ambientLight intensity={Math.PI / 2} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
				<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
				<Line points={[[-2, -1]]} color="black" lineWidth={10} />
				<Line points={[[0, 1, 1], [1, 1, 1]]} color="black" lineWidth={10} />
				<Box position={[1.2, 1, 0]} /> */}
				<ElementsController />
			</Suspense>

		</Canvas>
	)
}
export default SCanvas



function Box(props: MeshProps) {
	const meshRef = useRef(null!)
	const [hovered, setHover] = useState(false)
	const [active, setActive] = useState(false)

	// useFrame((state, delta) => (meshRef.current.rotation.x += delta))

	return (
		<mesh
			{...props}
			ref={meshRef}
			scale={active ? 1.5 : 1}
			onClick={(event) => setActive(!active)}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}>
			<boxGeometry args={[1, 1, 2]} />
			<meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
		</mesh>
	)
}