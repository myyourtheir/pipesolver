import { animated, useSpring } from '@react-spring/three'
import { Plane, Cylinder, } from '@react-three/drei'
import { ThreeEvent, extend, useThree } from '@react-three/fiber'
import { useDrag, useGesture } from '@use-gesture/react'
import { useContext, useEffect, useRef, useState } from 'react'
import { CanvasContext } from '../..'
import { OthograthicConfig } from '../../OthograthicConfig'
import * as THREE from 'three'
import useMovement from '../../utils/hooks/useMovement'
const AnimatedPlane = animated(Cylinder)

const MoveObj = ({ position, color, w = 2, h = 2 }:
	{ position: [number, number, number], color: string, w?: number, h?: number }) => {
	const objectRef = useRef<THREE.Mesh>(null!)
	const { bind, spring } = useMovement({ position, objectRef })
	return (
		<AnimatedPlane ref={objectRef} args={[0.5, 0.5, 2]} rotation={[0, 0, Math.PI / 2]} position={spring.position} {...bind() as any} castShadow>
			<meshStandardMaterial attach="material" color={color} />
		</AnimatedPlane>
	)
}

export default MoveObj