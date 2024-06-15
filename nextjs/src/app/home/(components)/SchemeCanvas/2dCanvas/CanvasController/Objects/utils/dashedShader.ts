import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

export const dashedMaterial = new THREE.ShaderMaterial({
	uniforms: {
		color: { value: new THREE.Color(0xff0000) },
		dashSize: { value: 0.1 },
		gapSize: { value: 0.1 },
		time: { value: 0 },
	},
	vertexShader: `
		varying vec3 vPosition;
		void main() {
			vPosition = position;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`,
	fragmentShader: `
		uniform vec3 color;
		uniform float dashSize;
		uniform float gapSize;
		uniform float time;
		varying vec3 vPosition;

		void main() {
			float dashPeriod = dashSize + gapSize;
			float dashFactor = mod(vPosition.z + time, dashPeriod);
			if (dashFactor < dashSize) {
				gl_FragColor = vec4(color, 1.0);
			} else {
				discard;
			}
		}
	`,
	transparent: true,
})